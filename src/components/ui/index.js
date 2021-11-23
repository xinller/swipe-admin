import VTooltip from './VTooltip';
import draggableResizable from './draggableResizable';



const components = {
    VTooltip,
    draggableResizable
}

const install = (Vue, opts = {}) => {
    Object.keys(components).forEach((key) => { Vue.component(key, components[key]); });
};
export default install;