import { useRef, useEffect } from 'react';
import {
  Clock,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  SRGBColorSpace,
  MathUtils,
  Vector2,
  Vector3,
  MeshPhysicalMaterial,
  ShaderChunk,
  Color,
  Object3D,
  InstancedMesh,
  PMREMGenerator,
  SphereGeometry,
  AmbientLight,
  PointLight,
  ACESFilmicToneMapping,
  Raycaster,
  Plane,
  // Shader, // Not exported from three main package
  // Material, // Not used
} from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

// Type definitions
interface BallpitProps {
  className?: string;
  count?: number;
  gravity?: number;
  friction?: number;
  wallBounce?: number;
  followCursor?: boolean;
  colors?: number[];
  ambientColor?: number;
  ambientIntensity?: number;
  lightIntensity?: number;
  materialParams?: {
    metalness?: number;
    roughness?: number;
    clearcoat?: number;
    clearcoatRoughness?: number;
  };
  minSize?: number;
  maxSize?: number;
  size0?: number;
  maxVelocity?: number;
  maxX?: number;
  maxY?: number;
  maxZ?: number;
  controlSphere0?: boolean;
}

interface ThreeConfig {
  canvas?: HTMLCanvasElement;
  id?: string;
  size?: 'parent' | 'window' | { width: number; height: number };
  rendererOptions?: any;
}

interface Size {
  width: number;
  height: number;
  wWidth: number;
  wHeight: number;
  ratio: number;
  pixelRatio: number;
}

interface TimeInfo {
  elapsed: number;
  delta: number;
}

interface MouseInfo {
  position: Vector2;
  nPosition: Vector2;
  hover: boolean;
  onEnter: () => void;
  onMove: () => void;
  onClick: () => void;
  onLeave: () => void;
  dispose?: () => void;
}

// Three.js wrapper class
class ThreeWrapper {
  private config: ThreeConfig;
  canvas!: HTMLCanvasElement;
  camera!: PerspectiveCamera;
  cameraMinAspect?: number;
  cameraMaxAspect?: number;
  cameraFov!: number;
  maxPixelRatio?: number;
  minPixelRatio?: number;
  scene!: Scene;
  renderer!: WebGLRenderer;
  private postprocessingInstance?: any;
  size: Size = { width: 0, height: 0, wWidth: 0, wHeight: 0, ratio: 0, pixelRatio: 0 };
  render = this.defaultRender;
  onBeforeRender: (time: TimeInfo) => void = () => {};
  onAfterRender: (time: TimeInfo) => void = () => {};
  onAfterResize: (size: Size) => void = () => {};
  private isVisible = false;
  private isRunning = false;
  isDisposed = false;
  private intersectionObserver?: IntersectionObserver;
  private resizeObserver?: ResizeObserver;
  private resizeTimeout?: number;
  private clock = new Clock();
  private time: TimeInfo = { elapsed: 0, delta: 0 };
  private animationId?: number;

  constructor(config: ThreeConfig) {
    this.config = { ...config };
    this.initCamera();
    this.initScene();
    this.initRenderer();
    this.resize();
    this.initObservers();
  }

  private initCamera(): void {
    this.camera = new PerspectiveCamera();
    this.cameraFov = this.camera.fov;
  }

  private initScene(): void {
    this.scene = new Scene();
  }

  private initRenderer(): void {
    if (this.config.canvas) {
      this.canvas = this.config.canvas;
    } else if (this.config.id) {
      this.canvas = document.getElementById(this.config.id) as HTMLCanvasElement;
    } else {
      console.error("Three: Missing canvas or id parameter");
      return;
    }
    this.canvas.style.display = "block";
    
    const rendererConfig = {
      canvas: this.canvas,
      powerPreference: "high-performance" as WebGLPowerPreference,
      ...(this.config.rendererOptions ?? {}),
    };
    
    this.renderer = new WebGLRenderer(rendererConfig);
    this.renderer.outputColorSpace = SRGBColorSpace;
  }

  private initObservers(): void {
    if (!(this.config.size instanceof Object)) {
      window.addEventListener("resize", this.handleResize.bind(this));
      if (this.config.size === "parent" && this.canvas.parentNode) {
        this.resizeObserver = new ResizeObserver(this.handleResize.bind(this));
        this.resizeObserver.observe(this.canvas.parentNode as Element);
      }
    }
    
    this.intersectionObserver = new IntersectionObserver(this.handleIntersection.bind(this), {
      root: null,
      rootMargin: "0px",
      threshold: 0,
    });
    this.intersectionObserver.observe(this.canvas);
    document.addEventListener("visibilitychange", this.handleVisibilityChange.bind(this));
  }

  private removeObservers(): void {
    window.removeEventListener("resize", this.handleResize.bind(this));
    this.resizeObserver?.disconnect();
    this.intersectionObserver?.disconnect();
    document.removeEventListener("visibilitychange", this.handleVisibilityChange.bind(this));
  }

  private handleIntersection(entries: IntersectionObserverEntry[]): void {
    this.isVisible = entries[0].isIntersecting;
    this.isVisible ? this.start() : this.stop();
  }

  private handleVisibilityChange(): void {
    if (this.isVisible) {
      document.hidden ? this.stop() : this.start();
    }
  }

  private handleResize(): void {
    if (this.resizeTimeout) clearTimeout(this.resizeTimeout);
    this.resizeTimeout = window.setTimeout(this.resize.bind(this), 100);
  }

  resize(): void {
    let width: number, height: number;
    
    if (this.config.size instanceof Object) {
      width = this.config.size.width;
      height = this.config.size.height;
    } else if (this.config.size === "parent" && this.canvas.parentNode) {
      const parent = this.canvas.parentNode as HTMLElement;
      width = parent.offsetWidth;
      height = parent.offsetHeight;
    } else {
      width = window.innerWidth;
      height = window.innerHeight;
    }
    
    this.size.width = width;
    this.size.height = height;
    this.size.ratio = width / height;
    this.updateCamera();
    this.updateRenderer();
    this.onAfterResize(this.size);
  }

  private updateCamera(): void {
    this.camera.aspect = this.size.width / this.size.height;
    if (this.camera.isPerspectiveCamera && this.cameraFov) {
      if (this.cameraMinAspect && this.camera.aspect < this.cameraMinAspect) {
        this.adjustFov(this.cameraMinAspect);
      } else if (this.cameraMaxAspect && this.camera.aspect > this.cameraMaxAspect) {
        this.adjustFov(this.cameraMaxAspect);
      } else {
        this.camera.fov = this.cameraFov;
      }
    }
    this.camera.updateProjectionMatrix();
    this.updateWorldSize();
  }

  private adjustFov(targetAspect: number): void {
    const tan = Math.tan(MathUtils.degToRad(this.cameraFov / 2)) / (this.camera.aspect / targetAspect);
    this.camera.fov = 2 * MathUtils.radToDeg(Math.atan(tan));
  }

  updateWorldSize(): void {
    if (this.camera.isPerspectiveCamera) {
      const fov = (this.camera.fov * Math.PI) / 180;
      this.size.wHeight = 2 * Math.tan(fov / 2) * this.camera.position.length();
      this.size.wWidth = this.size.wHeight * this.camera.aspect;
    }
  }

  private updateRenderer(): void {
    this.renderer.setSize(this.size.width, this.size.height);
    this.postprocessingInstance?.setSize(this.size.width, this.size.height);
    
    let pixelRatio = window.devicePixelRatio;
    if (this.maxPixelRatio && pixelRatio > this.maxPixelRatio) {
      pixelRatio = this.maxPixelRatio;
    } else if (this.minPixelRatio && pixelRatio < this.minPixelRatio) {
      pixelRatio = this.minPixelRatio;
    }
    
    this.renderer.setPixelRatio(pixelRatio);
    this.size.pixelRatio = pixelRatio;
  }

  get postprocessing(): any {
    return this.postprocessingInstance;
  }

  set postprocessing(value: any) {
    this.postprocessingInstance = value;
    this.render = value.render.bind(value);
  }

  private start(): void {
    if (this.isRunning) return;
    
    const animate = (): void => {
      this.animationId = requestAnimationFrame(animate);
      this.time.delta = this.clock.getDelta();
      this.time.elapsed += this.time.delta;
      this.onBeforeRender(this.time);
      this.render();
      this.onAfterRender(this.time);
    };
    
    this.isRunning = true;
    this.clock.start();
    animate();
  }

  private stop(): void {
    if (this.isRunning && this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.isRunning = false;
      this.clock.stop();
    }
  }

  private defaultRender(): void {
    this.renderer.render(this.scene, this.camera);
  }

  clear(): void {
    this.scene.traverse((object) => {
      if (object instanceof Object3D && 'isMesh' in object && object.isMesh) {
        const mesh = object as any;
        if (mesh.material && typeof mesh.material === "object") {
          Object.keys(mesh.material).forEach((key) => {
            const value = mesh.material[key];
            if (value && typeof value === "object" && typeof value.dispose === "function") {
              value.dispose();
            }
          });
          mesh.material.dispose();
          mesh.geometry.dispose();
        }
      }
    });
    this.scene.clear();
  }

  dispose(): void {
    this.removeObservers();
    this.stop();
    this.clear();
    this.postprocessingInstance?.dispose();
    this.renderer.dispose();
    this.isDisposed = true;
  }
}

// Mouse interaction system
const mouseMap = new Map<HTMLElement, MouseInfo>();
const mousePosition = new Vector2();
let isMouseListening = false;

function createMouse(config: { domElement: HTMLElement }): MouseInfo {
  const mouseInfo: MouseInfo = {
    position: new Vector2(),
    nPosition: new Vector2(),
    hover: false,
    onEnter: () => {},
    onMove: () => {},
    onClick: () => {},
    onLeave: () => {},
  };

  if (!mouseMap.has(config.domElement)) {
    mouseMap.set(config.domElement, mouseInfo);
    if (!isMouseListening) {
      document.body.addEventListener("pointermove", handleMouseMove as EventListener);
      document.body.addEventListener("pointerleave", handleMouseLeave as EventListener);
      document.body.addEventListener("click", handleMouseClick as EventListener);
      isMouseListening = true;
    }
  }

  mouseInfo.dispose = () => {
    mouseMap.delete(config.domElement);
    if (mouseMap.size === 0) {
      document.body.removeEventListener("pointermove", handleMouseMove as EventListener);
      document.body.removeEventListener("pointerleave", handleMouseLeave as EventListener);
      document.body.removeEventListener("click", handleMouseClick as EventListener);
      isMouseListening = false;
    }
  };

  return mouseInfo;
}

function handleMouseMove(event: PointerEvent): void {
  mousePosition.x = event.clientX;
  mousePosition.y = event.clientY;
  
  for (const [element, mouseInfo] of mouseMap) {
    const rect = element.getBoundingClientRect();
    if (isPointInRect(rect)) {
      updateMousePosition(mouseInfo, rect);
      if (!mouseInfo.hover) {
        mouseInfo.hover = true;
        mouseInfo.onEnter();
      }
      mouseInfo.onMove();
    } else if (mouseInfo.hover) {
      mouseInfo.hover = false;
      mouseInfo.onLeave();
    }
  }
}

function handleMouseClick(event: PointerEvent): void {
  mousePosition.x = event.clientX;
  mousePosition.y = event.clientY;
  
  for (const [element, mouseInfo] of mouseMap) {
    const rect = element.getBoundingClientRect();
    updateMousePosition(mouseInfo, rect);
    if (isPointInRect(rect)) {
      mouseInfo.onClick();
    }
  }
}

function handleMouseLeave(): void {
  for (const mouseInfo of mouseMap.values()) {
    if (mouseInfo.hover) {
      mouseInfo.hover = false;
      mouseInfo.onLeave();
    }
  }
}

function updateMousePosition(mouseInfo: MouseInfo, rect: DOMRect): void {
  mouseInfo.position.x = mousePosition.x - rect.left;
  mouseInfo.position.y = mousePosition.y - rect.top;
  mouseInfo.nPosition.x = (mouseInfo.position.x / rect.width) * 2 - 1;
  mouseInfo.nPosition.y = (-mouseInfo.position.y / rect.height) * 2 + 1;
}

function isPointInRect(rect: DOMRect): boolean {
  const { x, y } = mousePosition;
  return x >= rect.left && x <= rect.left + rect.width && 
         y >= rect.top && y <= rect.top + rect.height;
}

// Physics system
const { randFloat, randFloatSpread } = MathUtils;

// Reusable vectors for physics calculations
const tempVec1 = new Vector3();
const tempVec2 = new Vector3();
const tempVec3 = new Vector3();
const tempVec4 = new Vector3();
const tempVec5 = new Vector3();
const tempVec6 = new Vector3();
const tempVec7 = new Vector3();
const tempVec8 = new Vector3();
const tempVec9 = new Vector3();
const tempVec10 = new Vector3();

interface PhysicsConfig {
  count: number;
  gravity: number;
  friction: number;
  wallBounce: number;
  maxVelocity: number;
  maxX: number;
  maxY: number;
  maxZ: number;
  minSize: number;
  maxSize: number;
  size0: number;
  controlSphere0: boolean;
}

class Physics {
  public positionData: Float32Array;
  public velocityData: Float32Array;
  public sizeData: Float32Array;
  public center: Vector3;
  private config: PhysicsConfig;

  constructor(config: PhysicsConfig) {
    this.config = config;
    this.positionData = new Float32Array(3 * config.count).fill(0);
    this.velocityData = new Float32Array(3 * config.count).fill(0);
    this.sizeData = new Float32Array(config.count).fill(1);
    this.center = new Vector3();
    this.initializePositions();
    this.setSizes();
  }

  private initializePositions(): void {
    const { config, positionData } = this;
    this.center.toArray(positionData, 0);
    
    for (let i = 1; i < config.count; i++) {
      const index = 3 * i;
      positionData[index] = randFloatSpread(2 * config.maxX);
      positionData[index + 1] = randFloatSpread(2 * config.maxY);
      positionData[index + 2] = randFloatSpread(2 * config.maxZ);
    }
  }

  setSizes(): void {
    const { config, sizeData } = this;
    sizeData[0] = config.size0;
    
    for (let i = 1; i < config.count; i++) {
      sizeData[i] = randFloat(config.minSize, config.maxSize);
    }
  }

  update(timeInfo: TimeInfo): void {
    const { config, center, positionData, sizeData, velocityData } = this;
    let startIndex = 0;

    // Handle control sphere
    if (config.controlSphere0) {
      startIndex = 1;
      tempVec1.fromArray(positionData, 0);
      tempVec1.lerp(center, 0.1).toArray(positionData, 0);
      tempVec4.set(0, 0, 0).toArray(velocityData, 0);
    }

    // Update physics for all spheres
    for (let i = startIndex; i < config.count; i++) {
      const base = 3 * i;
      tempVec2.fromArray(positionData, base);
      tempVec5.fromArray(velocityData, base);

      // Apply gravity and friction
      tempVec5.y -= timeInfo.delta * config.gravity * sizeData[i];
      tempVec5.multiplyScalar(config.friction);
      tempVec5.clampLength(0, config.maxVelocity);

      // Update position
      tempVec2.add(tempVec5);
      tempVec2.toArray(positionData, base);
      tempVec5.toArray(velocityData, base);
    }

    // Handle collisions between spheres
    for (let i = startIndex; i < config.count; i++) {
      const base = 3 * i;
      tempVec2.fromArray(positionData, base);
      tempVec5.fromArray(velocityData, base);
      const radius = sizeData[i];

      for (let j = i + 1; j < config.count; j++) {
        const otherBase = 3 * j;
        tempVec3.fromArray(positionData, otherBase);
        tempVec6.fromArray(velocityData, otherBase);
        const otherRadius = sizeData[j];

        tempVec7.copy(tempVec3).sub(tempVec2);
        const distance = tempVec7.length();
        const sumRadius = radius + otherRadius;

        if (distance < sumRadius) {
          const overlap = sumRadius - distance;
          tempVec8.copy(tempVec7).normalize().multiplyScalar(0.5 * overlap);
          tempVec9.copy(tempVec8).multiplyScalar(Math.max(tempVec5.length(), 1));
          tempVec10.copy(tempVec8).multiplyScalar(Math.max(tempVec6.length(), 1));

          tempVec2.sub(tempVec8);
          tempVec5.sub(tempVec9);
          tempVec2.toArray(positionData, base);
          tempVec5.toArray(velocityData, base);

          tempVec3.add(tempVec8);
          tempVec6.add(tempVec10);
          tempVec3.toArray(positionData, otherBase);
          tempVec6.toArray(velocityData, otherBase);
        }
      }

      // Handle collision with control sphere
      if (config.controlSphere0) {
        tempVec7.copy(tempVec1).sub(tempVec2);
        const distance = tempVec7.length();
        const combinedRadius = radius + sizeData[0];

        if (distance < combinedRadius) {
          const difference = combinedRadius - distance;
          tempVec8.copy(tempVec7.normalize()).multiplyScalar(difference);
          tempVec9.copy(tempVec8).multiplyScalar(Math.max(tempVec5.length(), 2));
          tempVec2.sub(tempVec8);
          tempVec5.sub(tempVec9);
        }
      }

      // Handle wall collisions
      if (Math.abs(tempVec2.x) + radius > config.maxX) {
        tempVec2.x = Math.sign(tempVec2.x) * (config.maxX - radius);
        tempVec5.x = -tempVec5.x * config.wallBounce;
      }

      if (config.gravity === 0) {
        if (Math.abs(tempVec2.y) + radius > config.maxY) {
          tempVec2.y = Math.sign(tempVec2.y) * (config.maxY - radius);
          tempVec5.y = -tempVec5.y * config.wallBounce;
        }
      } else if (tempVec2.y - radius < -config.maxY) {
        tempVec2.y = -config.maxY + radius;
        tempVec5.y = -tempVec5.y * config.wallBounce;
      }

      const maxBoundary = Math.max(config.maxZ, config.maxSize || 1);
      if (Math.abs(tempVec2.z) + radius > maxBoundary) {
        tempVec2.z = Math.sign(tempVec2.z) * (config.maxZ - radius);
        tempVec5.z = -tempVec5.z * config.wallBounce;
      }

      tempVec2.toArray(positionData, base);
      tempVec5.toArray(velocityData, base);
    }
  }
}

// Custom material with subsurface scattering
class SubsurfaceMaterial extends MeshPhysicalMaterial {
  public uniforms: { [key: string]: { value: any } };

  constructor(parameters?: any) {
    super(parameters);
    
    this.uniforms = {
      thicknessDistortion: { value: 0.1 },
      thicknessAmbient: { value: 0 },
      thicknessAttenuation: { value: 0.1 },
      thicknessPower: { value: 2 },
      thicknessScale: { value: 10 },
    };

    this.defines = { ...this.defines, USE_UV: "" };

    this.onBeforeCompile = (shader: any) => {
      Object.assign(shader.uniforms, this.uniforms);
      
      shader.fragmentShader = `
        uniform float thicknessPower;
        uniform float thicknessScale;
        uniform float thicknessDistortion;
        uniform float thicknessAmbient;
        uniform float thicknessAttenuation;
      ` + shader.fragmentShader;

      shader.fragmentShader = shader.fragmentShader.replace(
        "void main() {",
        `
        void RE_Direct_Scattering(const in IncidentLight directLight, const in vec2 uv, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, inout ReflectedLight reflectedLight) {
          vec3 scatteringHalf = normalize(directLight.direction + (geometryNormal * thicknessDistortion));
          float scatteringDot = pow(saturate(dot(geometryViewDir, -scatteringHalf)), thicknessPower) * thicknessScale;
          #ifdef USE_COLOR
            vec3 scatteringIllu = (scatteringDot + thicknessAmbient) * vColor;
          #else
            vec3 scatteringIllu = (scatteringDot + thicknessAmbient) * diffuse;
          #endif
          reflectedLight.directDiffuse += scatteringIllu * thicknessAttenuation * directLight.color;
        }

        void main() {
        `
      );

      const lightsFragmentBegin = ShaderChunk.lights_fragment_begin.replace(
        /RE_Direct\( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight \);/g,
        `
          RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
          RE_Direct_Scattering(directLight, vUv, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, reflectedLight);
        `
      );

      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <lights_fragment_begin>",
        lightsFragmentBegin
      );
    };
  }
}

// Default configuration
const defaultConfig: BallpitProps = {
  count: 200,
  colors: [0x000000],
  ambientColor: 0xffffff,
  ambientIntensity: 1,
  lightIntensity: 200,
  materialParams: {
    metalness: 0.5,
    roughness: 0.5,
    clearcoat: 1,
    clearcoatRoughness: 0.15,
  },
  minSize: 0.5,
  maxSize: 1,
  size0: 1,
  gravity: 0.5,
  friction: 0.9975,
  wallBounce: 0.95,
  maxVelocity: 0.15,
  maxX: 5,
  maxY: 5,
  maxZ: 2,
  controlSphere0: false,
  followCursor: true,
};

const matrixHelper = new Object3D();

// Main Ballpit class
class BallpitSpheres extends InstancedMesh {
  public config: Required<BallpitProps>;
  public physics: Physics;
  public ambientLight!: AmbientLight;
  public light!: PointLight;

  constructor(renderer: WebGLRenderer, options: BallpitProps = {}) {
    const config = { ...defaultConfig, ...options } as Required<BallpitProps>;
    
    const roomEnvironment = new RoomEnvironment();
    const pmremGenerator = new PMREMGenerator(renderer);
    const envTexture = pmremGenerator.fromScene(roomEnvironment).texture;
    
    const geometry = new SphereGeometry();
    const material = new SubsurfaceMaterial({ 
      envMap: envTexture, 
      ...config.materialParams 
    });
    
    material.envMapRotation.x = -Math.PI / 2;
    
    super(geometry, material, config.count);
    
    this.config = config;
    this.physics = new Physics(config);
    this.setupLights();
    this.setColors(config.colors || [0x000000]);
  }

  private setupLights(): void {
    this.ambientLight = new AmbientLight(
      this.config.ambientColor,
      this.config.ambientIntensity
    );
    this.add(this.ambientLight);

    this.light = new PointLight(
      this.config.colors?.[0] || 0x000000,
      this.config.lightIntensity
    );
    this.add(this.light);
  }

  setColors(colors: number[]): void {
    if (Array.isArray(colors) && colors.length > 1) {
      const colorGradient = createColorGradient(colors);
      
      for (let i = 0; i < this.count; i++) {
        const color = colorGradient.getColorAt(i / this.count);
        this.setColorAt(i, color);
        
        if (i === 0) {
          this.light.color.copy(color);
        }
      }
      
      if (this.instanceColor) {
      this.instanceColor.needsUpdate = true;
      }
    }
  }

  update(timeInfo: TimeInfo): void {
    this.physics.update(timeInfo);
    
    for (let i = 0; i < this.count; i++) {
      matrixHelper.position.fromArray(this.physics.positionData, 3 * i);
      
      if (i === 0 && this.config.followCursor === false) {
        matrixHelper.scale.setScalar(0);
      } else {
        matrixHelper.scale.setScalar(this.physics.sizeData[i]);
      }
      
      matrixHelper.updateMatrix();
      this.setMatrixAt(i, matrixHelper.matrix);
      
      if (i === 0) {
        this.light.position.copy(matrixHelper.position);
      }
    }
    
    this.instanceMatrix.needsUpdate = true;
  }
}

// Color gradient utility
function createColorGradient(colors: number[]) {
  let colorArray: number[];
  let colorObjects: Color[];

  function setColors(newColors: number[]): void {
    colorArray = newColors;
    colorObjects = colorArray.map(color => new Color(color));
  }

  setColors(colors);

  return {
    setColors,
    getColorAt(ratio: number, output = new Color()): Color {
      const clampedRatio = Math.max(0, Math.min(1, ratio));
      const scaledPosition = clampedRatio * (colorArray.length - 1);
      const lowerIndex = Math.floor(scaledPosition);
      
      if (lowerIndex >= colorArray.length - 1) {
        return colorObjects[colorObjects.length - 1].clone();
      }
      
      const alpha = scaledPosition - lowerIndex;
      const startColor = colorObjects[lowerIndex];
      const endColor = colorObjects[lowerIndex + 1];
      
      output.r = startColor.r + alpha * (endColor.r - startColor.r);
      output.g = startColor.g + alpha * (endColor.g - startColor.g);
      output.b = startColor.b + alpha * (endColor.b - startColor.b);
      
      return output;
    },
  };
}

// Ballpit instance interface
interface BallpitInstance {
  three: ThreeWrapper;
  spheres: BallpitSpheres;
  setCount: (count: number) => void;
  togglePause: () => void;
  dispose: () => void;
}

// Main ballpit creation function
function createBallpit(canvas: HTMLCanvasElement, options: BallpitProps = {}): BallpitInstance {
  const three = new ThreeWrapper({
    canvas,
    size: "parent",
    rendererOptions: { antialias: true, alpha: true },
  });

  let spheres: BallpitSpheres;

  three.renderer.toneMapping = ACESFilmicToneMapping;
  three.camera.position.set(0, 0, 20);
  three.camera.lookAt(0, 0, 0);
  three.cameraMaxAspect = 1.5;
  three.resize();

  initialize(options);

  const raycaster = new Raycaster();
  const plane = new Plane(new Vector3(0, 0, 1), 0);
  const intersectionPoint = new Vector3();
  let isPaused = false;

  const mouse = createMouse({
    domElement: canvas,
  });

  mouse.onMove = () => {
    raycaster.setFromCamera(mouse.nPosition, three.camera);
    three.camera.getWorldDirection(plane.normal);
    raycaster.ray.intersectPlane(plane, intersectionPoint);
    spheres.physics.center.copy(intersectionPoint);
    spheres.config.controlSphere0 = true;
  };

  mouse.onLeave = () => {
    spheres.config.controlSphere0 = false;
  };

  function initialize(config: BallpitProps): void {
    if (spheres) {
      three.clear();
      three.scene.remove(spheres);
    }
    spheres = new BallpitSpheres(three.renderer, config);
    three.scene.add(spheres);
  }

  three.onBeforeRender = (timeInfo: TimeInfo) => {
    if (!isPaused) {
      spheres.update(timeInfo);
    }
  };

  three.onAfterResize = (size: Size) => {
    spheres.config.maxX = size.wWidth / 2;
    spheres.config.maxY = size.wHeight / 2;
  };

  return {
    three,
    get spheres() {
      return spheres;
    },
    setCount(count: number) {
      initialize({ ...spheres.config, count });
    },
    togglePause() {
      isPaused = !isPaused;
    },
    dispose() {
      mouse.dispose?.();
      three.dispose();
    },
  };
}

// React component
const Ballpit: React.FC<BallpitProps> = ({ 
  className = '', 
  followCursor = true, 
  ...props 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ballpitInstanceRef = useRef<BallpitInstance | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    ballpitInstanceRef.current = createBallpit(canvas, { 
      followCursor, 
      ...props 
    });

    return () => {
      if (ballpitInstanceRef.current) {
        ballpitInstanceRef.current.dispose();
      }
    };
  }, []); // Dependencies removed to prevent recreation

  return (
    <canvas
      className={className}
      ref={canvasRef}
      style={{ width: '100%', height: '100%' }}
    />
  );
};

export default Ballpit;