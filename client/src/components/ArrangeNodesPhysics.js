/*while (x):
    for each node:
        add a force proportional to dist from median
        add a constant frictional force that opposes direction of motion
        add a constant force opposing motion into either neighbor
        */

function arrangeNodes(layer) {
    let medians = medianHeuristic1(layer);
    
    let counter = 0;
    while (counter < 100) {
        counter++;
        for (let i = 0; i < layer.length - 1; i++) {
            let force = 0;
            force = (medians[layer[i].id] - layer[i].coord)

            if (layer[i].id - layer[i + 1].id < 1) {
                force += -1;
            }

            if (layer[i - 1].id - layer[i].id < 1) {
                force -= 1;
            }

            let friction = 0.2 * Math.sign(force);
            if (Math.abs(friction) < Math.abs(force)) {
                force -= friction;
            } else {
                force = 0;
            }

            force = Math.

            layer[i].coord += force;
        }
    }
}