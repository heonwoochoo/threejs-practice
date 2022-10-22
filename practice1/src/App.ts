import * as THREE from "three";

interface IApp {}

class App implements IApp {
  // protected : 클래스 외부에서 호출 금지
  protected _divContainer: Element;
  protected _renderer: THREE.WebGLRenderer;
  protected _scene: THREE.Scene;
  protected _camera!: THREE.PerspectiveCamera;
  protected _cube!: THREE.Mesh;

  constructor() {
    const divContainer = document.querySelector("#app");
    this._divContainer = divContainer as Element;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    divContainer?.appendChild(renderer.domElement);
    this._renderer = renderer;

    const scene = new THREE.Scene();
    this._scene = scene;

    this._setupCamera();
    this._setupLight();
    this._setupModel();

    window.onresize = this.resize.bind(this);
    this.resize();

    requestAnimationFrame(this.render.bind(this));
  }

  _setupCamera() {
    const width = this._divContainer?.clientWidth;
    const height = this._divContainer?.clientHeight;
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100);
    camera.position.z = 2;
    this._camera = camera;
  }

  _setupLight() {
    const color = 0xffffff;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    this._scene.add(light);
  }
  _setupModel() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshPhongMaterial({ color: 0x44a88 });

    const cube = new THREE.Mesh(geometry, material);

    this._scene.add(cube);
    this._cube = cube;
  }

  resize() {
    const width = this._divContainer.clientWidth;
    const height = this._divContainer.clientHeight;

    this._camera!.aspect = width / height;
    this._camera?.updateProjectionMatrix();

    this._renderer.setSize(width, height);
  }

  render(time: number) {
    // console.log(time);
    this._renderer.render(this._scene, this._camera as THREE.Camera);
    this.update(time);
    requestAnimationFrame(this.render.bind(this));
  }

  update(time: number) {
    time *= 0.001; // second unit
    this._cube!.rotation.x = time;
    this._cube!.rotation.y = time;
  }
}

export default App;
