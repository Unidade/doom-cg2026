#version 120

varying vec2 vTexCoord;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec3 vViewDir;

void main()
{
    // posição padrão usando a matriz fixa
    gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
    
    // passa a posição do vértice no espaço do objeto para o fragment shader
    vPosition = gl_Vertex.xyz;
    
    // calcula a normal aproximada baseada na posição (para losangos)
    // normal aponta para fora do losango
    vec3 pos = gl_Vertex.xyz;
    vNormal = normalize(pos);
    
    // direção da câmera no espaço do objeto (aproximada)
    // usa a posição do vértice transformada para calcular a direção de visualização
    vec3 posViewSpace = (gl_ModelViewMatrix * gl_Vertex).xyz;
    vViewDir = normalize(-posViewSpace); // direção oposta à posição (câmera está na origem)
    
    // pega as coordenadas de textura do pipeline fixo (mesmo sem textura, para compatibilidade)
    vTexCoord = gl_MultiTexCoord0.st;
}
