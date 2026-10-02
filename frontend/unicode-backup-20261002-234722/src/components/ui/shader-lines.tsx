import { useEffect, useRef } from "react";

export function ShaderAnimation() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl =
      (canvas.getContext("webgl") as WebGLRenderingContext | null) ||
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);

    if (!gl) {
      console.warn("[MIMIC] WebGL not supported, plasma fallback active.");
      return;
    }

    const vertexShaderSource = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    const fragmentShaderSource = `
      #define TWO_PI 6.28318530718
      #define PI 3.14159265359

      precision highp float;

      uniform vec2 resolution;
      uniform float time;

      float random(in float x) {
        return fract(sin(x) * 1e4);
      }

      void main(void) {
        vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);

        // Controlled mosaic line grid for tactical AI lab plasma feel
        vec2 fMosaicScal = vec2(4.0, 2.0);
        vec2 vScreenSize = vec2(300.0, 300.0);

        uv.x = floor(uv.x * vScreenSize.x / fMosaicScal.x) / (vScreenSize.x / fMosaicScal.x);
        uv.y = floor(uv.y * vScreenSize.y / fMosaicScal.y) / (vScreenSize.y / fMosaicScal.y);

        float t = time * 0.045 + random(uv.x) * 0.35;
        float lineWidth = 0.00075;

        float energy = 0.0;
        for (int i = 0; i < 5; i++) {
          float fi = float(i);
          energy += lineWidth * (fi * fi + 1.2) /
            abs(fract(t + fi * 0.018) * 1.08 - length(uv) * 0.95);
        }

        // Warm Plasma palette:
        // #160B0B = vec3(0.086, 0.043, 0.043)
        // #C2402A = vec3(0.761, 0.251, 0.165)
        // #F49D37 = vec3(0.957, 0.616, 0.216)
        // #FFE8C2 = vec3(1.000, 0.910, 0.761)

        vec3 cBase = vec3(0.086, 0.043, 0.043);
        vec3 cEmber = vec3(0.761, 0.251, 0.165);
        vec3 cAmber = vec3(0.957, 0.616, 0.216);
        vec3 cCream = vec3(1.000, 0.910, 0.761);

        vec3 color = cBase;
        color = mix(color, cEmber, clamp(energy * 1.4, 0.0, 1.0));
        color = mix(color, cAmber, clamp((energy - 0.32) * 1.9, 0.0, 1.0));
        color = mix(color, cCream, clamp((energy - 0.72) * 2.8, 0.0, 1.0));

        // Subdued ambient alpha so all UI text remains crystal legible
        float alpha = clamp(energy * 0.38 + 0.06, 0.0, 0.70);

        gl_FragColor = vec4(color, alpha);
      }
    `;

    function createShader(glContext: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
      const shader = glContext.createShader(type);
      if (!shader) return null;
      glContext.shaderSource(shader, source);
      glContext.compileShader(shader);
      if (!glContext.getShaderParameter(shader, glContext.COMPILE_STATUS)) {
        console.error("[MIMIC] Shader compile error:", glContext.getShaderInfoLog(shader));
        glContext.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("[MIMIC] Program link error:", gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ]);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const resolutionLocation = gl.getUniformLocation(program, "resolution");
    const timeLocation = gl.getUniformLocation(program, "time");

    let animationFrameId: number | null = null;
    let startTime = performance.now();
    let isPaused = false;

    function resize() {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.floor(window.innerWidth * dpr);
      const height = Math.floor(window.innerHeight * dpr);

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl?.viewport(0, 0, width, height);
      }
    }

    function render() {
      if (isPaused || !canvas || !gl) return;

      const currentTime = (performance.now() - startTime) * 0.001;
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform1f(timeLocation, currentTime);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animationFrameId = requestAnimationFrame(render);
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        isPaused = true;
        if (animationFrameId !== null) cancelAnimationFrame(animationFrameId);
      } else {
        isPaused = false;
        startTime = performance.now();
        animationFrameId = requestAnimationFrame(render);
      }
    };

    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    resize();
    animationFrameId = requestAnimationFrame(render);

    return () => {
      if (animationFrameId !== null) cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteBuffer(positionBuffer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 h-full w-full -z-10"
      aria-hidden="true"
      style={{
        opacity: 0.85,
        mixBlendMode: "screen",
      }}
    />
  );
}

export default ShaderAnimation;