import { Node, Shaders } from "gl-react";
import { Surface } from "gl-react-expo";
import React, { memo } from "react";
import { Animated, Image } from "react-native";

// Filter shaders
const shaders = Shaders.create({
  grayscale: {
    frag: `
      precision highp float;
      varying vec2 uv;
      uniform sampler2D t;
      uniform float intensity;
      
      void main() {
        vec4 c = texture2D(t, uv);
        float gray = dot(c.rgb, vec3(0.299, 0.587, 0.114));
        vec3 grayscale = vec3(gray);
        gl_FragColor = vec4(mix(c.rgb, grayscale, intensity), c.a);
      }
    `,
  },
  sepia: {
    frag: `
      precision highp float;
      varying vec2 uv;
      uniform sampler2D t;
      uniform float intensity;
      
      void main() {
        vec4 c = texture2D(t, uv);
        vec3 sepia = vec3(
          dot(c.rgb, vec3(0.393, 0.769, 0.189)),
          dot(c.rgb, vec3(0.349, 0.686, 0.168)),
          dot(c.rgb, vec3(0.272, 0.534, 0.131))
        );
        gl_FragColor = vec4(mix(c.rgb, sepia, intensity), c.a);
      }
    `,
  },
  vintage: {
    frag: `
      precision highp float;
      varying vec2 uv;
      uniform sampler2D t;
      uniform float intensity;
      
      void main() {
        vec4 c = texture2D(t, uv);
        vec3 vintage = vec3(
          c.r * 0.9 + 0.1,
          c.g * 0.8 + 0.2,
          c.b * 0.7 + 0.3
        );
        gl_FragColor = vec4(mix(c.rgb, vintage, intensity), c.a);
      }
    `,
  },
});

// Filter component
const FilteredImage = ({ uri, filter, intensity }: { uri: string; filter: string; intensity: number }) => {
  const shader = shaders[filter as keyof typeof shaders] || shaders.grayscale;
  
  return (
    <Node shader={shader} uniforms={{ t: uri, intensity }} />
  );
};

interface FilterPreviewProps {
  uri: string;
  filter: string;
  intensity: number;
  rotation: number;
  scale: Animated.Value;
  style: any;
}

const FilterPreview = memo(({ uri, filter, intensity, rotation, scale, style }: FilterPreviewProps) => {
  return (
    <Animated.View
      style={[
        style,
        {
          transform: [
            { rotate: `${rotation}deg` },
            { scale: scale },
          ],
        },
      ]}
    >
      {filter === "none" ? (
        <Image source={{ uri }} style={{ width: "100%", height: "100%", resizeMode: "contain" }} />
      ) : (
        <Surface style={{ width: "100%", height: "100%", resizeMode: "contain" }}>
          <FilteredImage
            uri={uri}
            filter={filter}
            intensity={intensity}
          />
        </Surface>
      )}
    </Animated.View>
  );
});

FilterPreview.displayName = "FilterPreview";

export default FilterPreview;
