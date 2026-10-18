/* Turfarium: schematic soil/root preview tiles retired; retain real lawn profiles. */
(()=>{'use strict';
 const remove=()=>document.querySelectorAll('.tf-quick-visuals').forEach(node=>node.remove());
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',remove,{once:true});else remove();
 window.addEventListener('load',remove,{once:true});
})();
