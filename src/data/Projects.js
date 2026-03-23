const PROJECTS = [
  {
    id: 'voxel-renderer',
    title: 'Voxel Renderer',
    short: 'Minecraft-style voxel engine built with Vulkan.',
    tags: ['Vulkan', 'C++'],
    component: () => import('/src/projects/panels/VulkcraftPanel.jsx'),
  },
  {
    id: 'algo-viz',
    title: 'Algorithm Visualizer',
    short: 'Real-time algorithm visualization tool built in Godot with Python.',
    tags: ['Godot', 'Python'],
    component: () => import('/src/projects/panels/AgWizPanel.jsx'),
  },
]

export default PROJECTS