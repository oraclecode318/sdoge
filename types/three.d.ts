import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

declare module '@react-three/drei' {
  export function useGLTF<T extends string | string[]>(
    path: T,
    useDraco?: boolean | string,
    useMeshOpt?: boolean,
    extendLoader?: (loader: any) => void
  ): GLTF & Record<string, any>;
}

