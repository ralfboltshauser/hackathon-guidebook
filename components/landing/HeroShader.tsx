"use client";

import { useEffect, useRef } from "react";
import type { MotionValue } from "framer-motion";

const MAX_DRAWING_BUFFER_PIXELS = 3_000_000;
const FALLBACK_IMAGE_WIDTH = 1536;
const FALLBACK_IMAGE_HEIGHT = 1024;

const vertexShader = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform sampler2D uImage;
  uniform float uTime;
  uniform float uScroll;
  uniform vec2 uPointer;
  uniform vec2 uResolution;
  uniform vec2 uImageResolution;

  varying vec2 vUv;

  float hash21(vec2 point) {
    point = fract(point * vec2(123.34, 456.21));
    point += dot(point, point + 45.32);
    return fract(point.x * point.y);
  }

  float noise21(vec2 point) {
    vec2 cell = floor(point);
    vec2 local = fract(point);
    local = local * local * (3.0 - 2.0 * local);

    float bottomLeft = hash21(cell);
    float bottomRight = hash21(cell + vec2(1.0, 0.0));
    float topLeft = hash21(cell + vec2(0.0, 1.0));
    float topRight = hash21(cell + vec2(1.0, 1.0));

    return mix(
      mix(bottomLeft, bottomRight, local.x),
      mix(topLeft, topRight, local.x),
      local.y
    );
  }

  vec2 coverUv(vec2 uv) {
    float screenAspect = uResolution.x / max(uResolution.y, 1.0);
    float imageAspect = uImageResolution.x / max(uImageResolution.y, 1.0);
    vec2 scale = vec2(1.0);

    if (screenAspect > imageAspect) {
      scale.y = imageAspect / screenAspect;
    } else {
      scale.x = screenAspect / imageAspect;
    }

    return (uv - 0.5) * scale + 0.5;
  }

  void main() {
    float screenAspect = uResolution.x / max(uResolution.y, 1.0);
    vec2 pointerDelta = vUv - uPointer;
    pointerDelta.x *= screenAspect;

    float pointerEnergy = exp(-dot(pointerDelta, pointerDelta) * 7.5);
    float slowTime = uTime * 0.12;
    vec2 flowSpace = vUv * vec2(max(screenAspect, 0.72), 1.0) * 3.15;
    float flowA = noise21(flowSpace + vec2(slowTime, -slowTime * 0.72));
    float flowB = noise21(
      flowSpace * 1.71 + vec2(-slowTime * 0.83, slowTime * 1.08) + 8.43
    );
    vec2 flow = vec2(flowA, flowB) - 0.5;

    vec2 tangent = normalize(vec2(-pointerDelta.y, pointerDelta.x) + 0.0001);
    float scrollWave = sin(
      (vUv.y * 3.7 + uScroll * 1.45 + flowA * 0.72) * 6.28318530718
    );

    vec2 imageUv = coverUv(vUv);
    imageUv += flow * mix(0.006, 0.012, uScroll);
    imageUv += tangent * pointerEnergy * 0.012;
    imageUv.x += scrollWave * mix(0.0015, 0.0045, uScroll);

    vec2 spectralDirection = normalize(
      flow + tangent * pointerEnergy * 0.9 + vec2(0.0001)
    );
    float spectralOffset = 0.0014 + pointerEnergy * 0.0042 + uScroll * 0.0018;

    vec2 redUv = clamp(
      imageUv + spectralDirection * spectralOffset,
      vec2(0.002),
      vec2(0.998)
    );
    vec2 greenUv = clamp(imageUv, vec2(0.002), vec2(0.998));
    vec2 blueUv = clamp(
      imageUv - spectralDirection * spectralOffset,
      vec2(0.002),
      vec2(0.998)
    );

    vec4 centerSample = texture2D(uImage, greenUv);
    vec3 color = vec3(
      texture2D(uImage, redUv).r,
      centerSample.g,
      texture2D(uImage, blueUv).b
    );

    vec3 coolGrade = vec3(0.97, 1.015, 1.06);
    vec3 warmGrade = vec3(1.045, 0.985, 1.015);
    color *= mix(coolGrade, warmGrade, smoothstep(0.0, 1.0, uScroll));
    color += pointerEnergy * vec3(0.024, 0.008, 0.038);

    float grainFrame = floor(uTime * 24.0);
    float grain = hash21(gl_FragCoord.xy + grainFrame * 17.0) - 0.5;
    color += grain * 0.018;

    float edge = smoothstep(0.38, 0.82, length(vUv - 0.5) * 1.35);
    color *= 1.0 - edge * 0.11;

    gl_FragColor = vec4(max(color, 0.0), centerSample.a);
    #include <colorspace_fragment>
  }
`;

type HeroShaderProps = {
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
  scrollProgress: MotionValue<number>;
  disabled: boolean;
  className?: string;
};

type ShaderUniforms = {
  uImage: { value: import("three").Texture };
  uTime: { value: number };
  uScroll: { value: number };
  uPointer: { value: import("three").Vector2 };
  uResolution: { value: import("three").Vector2 };
  uImageResolution: { value: import("three").Vector2 };
};

const clamp01 = (value: number, fallback = 0.5) => {
  if (!Number.isFinite(value)) return fallback;
  return Math.min(1, Math.max(0, value));
};

export function HeroShader({
  pointerX,
  pointerY,
  scrollProgress,
  disabled,
  className,
}: HeroShaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvasElement = canvasRef.current;
    if (!canvasElement) return;
    const canvas: HTMLCanvasElement = canvasElement;

    canvas.style.opacity = "0";
    canvas.style.transition = "none";

    if (disabled) return;

    let cancelled = false;
    let teardown: (() => void) | undefined;

    async function initialize() {
      let THREE: typeof import("three");

      try {
        THREE = await import("three");
      } catch {
        return;
      }

      if (cancelled) return;

      let renderer: import("three").WebGLRenderer | undefined;
      let scene: import("three").Scene | undefined;
      let camera: import("three").OrthographicCamera | undefined;
      let geometry: import("three").PlaneGeometry | undefined;
      let material: import("three").ShaderMaterial | undefined;
      let texture: import("three").Texture | undefined;
      let uniforms: ShaderUniforms | undefined;
      let resizeObserver: ResizeObserver | undefined;
      let intersectionObserver: IntersectionObserver | undefined;
      let unsubscribePointerX: (() => void) | undefined;
      let unsubscribePointerY: (() => void) | undefined;
      let unsubscribeScroll: (() => void) | undefined;
      let fadeFrame = 0;
      let cleanedUp = false;
      let ready = false;
      let running = false;
      let inView = true;
      let contextLost = false;
      let elapsed = 0;
      let lastFrameTime = 0;
      let cssWidth = 1;
      let cssHeight = 1;
      let rawPointerX = pointerX.get();
      let rawPointerY = pointerY.get();

      const normalizePointer = (value: number, extent: number) => {
        if (!Number.isFinite(value)) return 0.5;
        if (value >= 0 && value <= 1) return value;
        return clamp01(value / Math.max(extent, 1));
      };

      const updatePointerUniform = () => {
        if (!uniforms) return;

        const x = normalizePointer(rawPointerX, cssWidth);
        const y = normalizePointer(rawPointerY, cssHeight);
        uniforms.uPointer.value.set(x, 1 - y);
      };

      const renderFrame = (time: number) => {
        if (!renderer || !scene || !camera || !uniforms || contextLost) return;

        if (lastFrameTime === 0) lastFrameTime = time;
        elapsed += Math.min((time - lastFrameTime) / 1000, 0.05);
        lastFrameTime = time;
        uniforms.uTime.value = elapsed;
        renderer.render(scene, camera);
      };

      const syncAnimationLoop = () => {
        if (!renderer) return;

        const shouldRun =
          ready && inView && !document.hidden && !contextLost && !cleanedUp;

        if (shouldRun === running) return;
        running = shouldRun;
        lastFrameTime = 0;
        renderer.setAnimationLoop(shouldRun ? renderFrame : null);
      };

      const resize = (width?: number, height?: number) => {
        if (!renderer || !uniforms) return;

        const bounds =
          width === undefined || height === undefined
            ? canvas.getBoundingClientRect()
            : undefined;
        cssWidth = Math.max(1, Math.round(width ?? bounds?.width ?? 1));
        cssHeight = Math.max(1, Math.round(height ?? bounds?.height ?? 1));

        const nativePixelRatio = Math.max(window.devicePixelRatio || 1, 0.25);
        const cappedPixelRatio = Math.sqrt(
          MAX_DRAWING_BUFFER_PIXELS / (cssWidth * cssHeight),
        );
        const pixelRatio = Math.max(
          0.25,
          Math.min(nativePixelRatio, cappedPixelRatio),
        );

        renderer.setPixelRatio(pixelRatio);
        renderer.setSize(cssWidth, cssHeight, false);
        renderer.getDrawingBufferSize(uniforms.uResolution.value);
        updatePointerUniform();

        if (ready && !running && !contextLost && scene && camera) {
          renderer.render(scene, camera);
        }
      };

      const showCanvas = () => {
        window.cancelAnimationFrame(fadeFrame);
        canvas.style.transition =
          "opacity 640ms cubic-bezier(0.165, 0.84, 0.44, 1)";
        fadeFrame = window.requestAnimationFrame(() => {
          if (!cleanedUp && !contextLost) canvas.style.opacity = "1";
        });
      };

      const handleVisibilityChange = () => {
        syncAnimationLoop();
      };

      const handleWindowResize = () => {
        resize();
      };

      const handleContextLost = () => {
        contextLost = true;
        syncAnimationLoop();
        canvas.style.transition = "opacity 120ms ease-out";
        canvas.style.opacity = "0";
      };

      const handleContextRestored = () => {
        contextLost = false;
        resize();

        if (ready && renderer && scene && camera) {
          renderer.render(scene, camera);
          showCanvas();
        }

        syncAnimationLoop();
      };

      const cleanup = () => {
        if (cleanedUp) return;
        cleanedUp = true;
        ready = false;
        running = false;

        window.cancelAnimationFrame(fadeFrame);
        resizeObserver?.disconnect();
        intersectionObserver?.disconnect();
        unsubscribePointerX?.();
        unsubscribePointerY?.();
        unsubscribeScroll?.();
        document.removeEventListener("visibilitychange", handleVisibilityChange);
        window.removeEventListener("resize", handleWindowResize);
        canvas.removeEventListener("webglcontextlost", handleContextLost);
        canvas.removeEventListener("webglcontextrestored", handleContextRestored);

        renderer?.setAnimationLoop(null);
        geometry?.dispose();
        material?.dispose();
        texture?.dispose();
        renderer?.dispose();

        canvas.style.opacity = "0";
        canvas.style.transition = "none";
      };

      teardown = cleanup;

      try {
        const context = canvas.getContext("webgl2", {
          alpha: true,
          antialias: false,
          depth: false,
          failIfMajorPerformanceCaveat: false,
          powerPreference: "high-performance",
          premultipliedAlpha: true,
          preserveDrawingBuffer: false,
          stencil: false,
        });

        if (!context) {
          cleanup();
          return;
        }

        renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: false,
          canvas,
          context,
          depth: false,
          powerPreference: "high-performance",
          premultipliedAlpha: true,
          preserveDrawingBuffer: false,
          stencil: false,
        });
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.setClearColor(0x000000, 0);

        canvas.addEventListener("webglcontextlost", handleContextLost);
        canvas.addEventListener("webglcontextrestored", handleContextRestored);

        const loadedTexture = await new THREE.TextureLoader().loadAsync(
          "/landing/pressure-object.webp",
        );

        if (cancelled || cleanedUp) {
          loadedTexture.dispose();
          return;
        }

        texture = loadedTexture;
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.generateMipmaps = false;

        const image = texture.image as HTMLImageElement;
        const imageWidth =
          image.naturalWidth || image.width || FALLBACK_IMAGE_WIDTH;
        const imageHeight =
          image.naturalHeight || image.height || FALLBACK_IMAGE_HEIGHT;

        uniforms = {
          uImage: { value: texture },
          uTime: { value: 0 },
          uScroll: { value: clamp01(scrollProgress.get(), 0) },
          uPointer: { value: new THREE.Vector2(0.5, 0.5) },
          uResolution: { value: new THREE.Vector2(1, 1) },
          uImageResolution: {
            value: new THREE.Vector2(imageWidth, imageHeight),
          },
        };

        scene = new THREE.Scene();
        camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
        camera.position.z = 1;
        geometry = new THREE.PlaneGeometry(2, 2, 1, 1);
        material = new THREE.ShaderMaterial({
          depthTest: false,
          depthWrite: false,
          fragmentShader,
          toneMapped: false,
          uniforms,
          vertexShader,
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.frustumCulled = false;
        scene.add(mesh);

        unsubscribePointerX = pointerX.on("change", (value) => {
          rawPointerX = value;
          updatePointerUniform();
        });
        unsubscribePointerY = pointerY.on("change", (value) => {
          rawPointerY = value;
          updatePointerUniform();
        });
        unsubscribeScroll = scrollProgress.on("change", (value) => {
          if (uniforms) uniforms.uScroll.value = clamp01(value, 0);
        });

        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("resize", handleWindowResize, { passive: true });

        if ("ResizeObserver" in window) {
          resizeObserver = new ResizeObserver(([entry]) => {
            if (!entry) return;
            resize(entry.contentRect.width, entry.contentRect.height);
          });
          resizeObserver.observe(canvas);
        }

        const bounds = canvas.getBoundingClientRect();
        inView =
          bounds.width > 0 &&
          bounds.height > 0 &&
          bounds.bottom > 0 &&
          bounds.top < window.innerHeight;

        if ("IntersectionObserver" in window) {
          intersectionObserver = new IntersectionObserver(([entry]) => {
            inView = Boolean(entry?.isIntersecting && entry.intersectionRatio > 0);
            syncAnimationLoop();
          });
          intersectionObserver.observe(canvas);
        }

        resize();
        updatePointerUniform();
        ready = true;
        renderer.render(scene, camera);
        showCanvas();
        syncAnimationLoop();
      } catch {
        cleanup();
      }
    }

    void initialize();

    return () => {
      cancelled = true;
      teardown?.();
      canvas.style.opacity = "0";
      canvas.style.transition = "none";
    };
  }, [disabled, pointerX, pointerY, scrollProgress]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={{
        display: "block",
        height: "100%",
        opacity: 0,
        pointerEvents: "none",
        transition: "none",
        width: "100%",
      }}
    />
  );
}
