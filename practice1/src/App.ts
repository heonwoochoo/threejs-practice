import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
interface IApp {}

class App implements IApp {
  // protected : 클래스 외부에서 호출 금지
  protected _divContainer: HTMLElement;
  protected _renderer: THREE.WebGLRenderer;
  protected _scene: THREE.Scene;
  protected _camera!: THREE.PerspectiveCamera;
  //   protected _cube: THREE.Mesh;

  constructor() {
    const divContainer = document.querySelector("#app");
    this._divContainer = divContainer as HTMLElement;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    divContainer?.appendChild(renderer.domElement);
    this._renderer = renderer;

    const scene = new THREE.Scene();
    this._scene = scene;

    this._setupCamera();
    this._setupLight();
    this._setupModel();
    this._setupControls();

    window.onresize = this.resize.bind(this);
    this.resize();

    requestAnimationFrame(this.render.bind(this));
  }

  _setupControls() {
    new OrbitControls(this._camera, this._divContainer);
  }

  _setupCamera() {
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1500
    );
    camera.position.set(1000, 0, 0);
    this._camera = camera;
  }

  _setupLight() {
    const color = 0xffffff;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);

    this._scene.add(light);

    this._scene.add(new THREE.AmbientLight(color, 0.3));
  }
  _setupModel() {
    const partWidth = 50;
    const partHeight = 200;
    const geometry = new THREE.CylinderGeometry(
      partWidth * 0.65,
      partWidth,
      partHeight,
      8
    );
    const color = new THREE.Color("#a04500");
    const material = new THREE.MeshPhongMaterial({ color });

    const mesh = new THREE.Mesh(geometry, material);

    // mesh에 대한 변환행렬을 y축에 대해서 높이의 절반만큼 이동
    mesh.matrix.makeTranslation(0, -partHeight / 2, 0);

    // 기본적으로 모든 렌더링 프레임마다
    // Mesh의 position, rotation, scale 속성값이
    // Local Transform Matrix에 반영됨
    // 행렬을 직접 조작할 경우 렌더링 될 때마다 변환행렬이 재계산 되지 않도록 아래코드 추가함
    mesh.matrixAutoUpdate = false;

    this._scene.add(mesh);

    function tree(
      scene: THREE.Scene,
      level: number,
      matrix: THREE.Matrix4,
      color: THREE.Color
    ) {
      if (level === 0) return;
      const tempMatrix = new THREE.Matrix4();

      // 가지1 생성 시작
      const newColor1 = color.clone();
      newColor1.g += 0.7 / levels;
      const material1 = new THREE.MeshPhongMaterial({ color: newColor1 });
      const mesh1 = mesh.clone();
      mesh1.material = material1;
      //   const mesh1 = new THREE.Mesh(geometry, material1);

      // 단위행렬 생성
      const newMatrix1 = new THREE.Matrix4();
      newMatrix1
        .multiply(tempMatrix.makeRotationY(Math.PI / 2)) // y축으로 90도 회전
        .multiply(tempMatrix.makeTranslation(partWidth / 2, 0, 0)) // x축으로 가지 너비의 절반만큼 이동
        .multiply(tempMatrix.makeRotationZ(-Math.PI / 4)) // z축으로 -45도 회전
        .multiply(tempMatrix.makeScale(0.75, 0.75, 0.75)) // 스케일 0.75배
        .multiply(tempMatrix.makeTranslation(0, partHeight, 0)); // y축으로 가지길이만큼 이동

      mesh1.matrix.copy(newMatrix1.multiply(matrix));
      mesh1.matrixAutoUpdate = false;
      scene.add(mesh1);

      tree(scene, level - 1, newMatrix1, newColor1);

      // 가지2 생성 시작
      const newColor2 = color.clone();
      newColor2.g += 0.64 / levels;
      const material2 = new THREE.MeshPhongMaterial({ color: newColor2 });
      const mesh2 = mesh.clone();
      mesh2.material = material2;
      //   const mesh2 = new THREE.Mesh(geometry, material2);

      const newMatrix2 = new THREE.Matrix4();
      newMatrix2
        .multiply(tempMatrix.makeRotationY(Math.PI / 2))
        .multiply(tempMatrix.makeTranslation(-partWidth / 2, 0, 0))
        .multiply(tempMatrix.makeRotationZ(Math.PI / 4))
        .multiply(tempMatrix.makeScale(0.75, 0.75, 0.75))
        .multiply(tempMatrix.makeTranslation(0, partHeight, 0));

      mesh2.matrix.copy(newMatrix2.multiply(matrix));
      mesh2.matrixAutoUpdate = false;
      scene.add(mesh2);

      tree(scene, level - 1, newMatrix2, newColor2);
    }

    const levels = 6;
    tree(this._scene, levels, mesh.matrix, color);
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
    // this._cube!.rotation.x = time;
    // this._cube!.rotation.y = time;
  }
}

export default App;
