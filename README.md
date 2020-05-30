# Visualizing Fluid Particle Flow using Three.js

![GitHub](https://img.shields.io/github/license/samujjwaal/Visualize-Fluid-particle-Flow)
![GitHub last commit (branch)](https://img.shields.io/github/last-commit/samujjwaal/Visualize-Fluid-particle-Flow/master)
![GitHub top language](https://img.shields.io/github/languages/top/samujjwaal/Visualize-Fluid-particle-Flow)
![GitHub repo size](https://img.shields.io/github/repo-size/samujjwaal/Visualize-Fluid-particle-Flow)

This project was done as a course assignment for CS529: Visual Data Science course at the University of Illinois at Chicago during the 
Fall 2019 term.

----

For the assignment we worked on a computational fluid flow simulation dataset from the San Diego Supercomputing Center. 
More deatils regarding the science behind the data for simulation can be found [here](http://www.uni-kl.de/sciviscontest).

The professor provided us with the dataset, and example Three.js code for loading up the dataset and displaying a point cloud 
[here](https://github.com/uic-evl/cs529-vds).

Javascript libraries used: [D3.js](https://github.com/d3/d3) and [THREE.js](https://github.com/mrdoob/three.js)

----

Deliverables for the assignment included:

* Show the data as a point cloud

* Colormap the point cloud by concentration

* Create a second view using D3 and show a vertical 2D slice of the data in it

* Allow the user to rotate the cylinder containing the flow

* Add a 2D cut-plane filter to the 3D flow (vertical XY rectangle in the 3D view, and user moves the rectangle through the flow along the Z axis)

* Link the 3D view and the 2D view through the rectangle filter ( show in the 2D view only the 3D points inside the rectangle)

* Implement a naive brushing and linking operation (gray out all the 3D points outside the rectangle cut-plane)

* Use D3 to add more controls or text to the interface.

## Usage Details

The project can be viewed at [Flow Visualization](https://samujjwaal.github.io/Visualize-Fluid-Particle-Flow).

To run the project locally, open the terminal and follow these steps: 
1. Run: `git clone https://github.com/samujjwaal/Visualize-Fluid-Particle-Flow.git`
2. Start an http server: `python -m http.server 8888`
3. Open http://localhost:8888 in a browser to view the project
