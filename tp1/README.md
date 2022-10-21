# SGI 2022/2023 - TP1

## Group: T0xG0y

| Name             | Number    | E-Mail             |
| ---------------- | --------- | ------------------ |
| Diogo Maia         | 201904974 | up201904974@fe.up.pt                |
| Luis Viegas         | 201904979 |  up201904974@fe.up.pt         |

----
## Project information

- We implemented every required primitive as it was intended in the project description. We are specially proud on the MyCylinder since it can be a Cylinder, a Cone or a Cylinder with different base and top radius depending on the parameters given to it.

- About with geometric transformations, we implemented its XML parsing on both the 'transformations' block and the transformations themselves. The transformations can chained and hereditary, as it was intended.

- When speaking about materials, we implemented its parsing, as well as the inheritance of materials. It is possible for a component to have multiple materials, and those can be changed by pressing 'm'/'M'. We also implemented textures which allows the user to apply a texture to a primitive and scale it as he intends to by specifying a 'length_s' and 'length_t' on the 'texture' block in the component section.

- Cameras (perspectives and ortho) and lights(omni and spot) were implemented as well.

- In the end, we implemented on the Interface, the possibility for our user to display the axis, to toggle on/off the lights and to change the camera.  

- Scene
  - (Brief description of the created scene)
  - (relative link to the scene)
----
## Issues/Problems

- We had a consistent bug where the light would follow the camera when we would use the mouse. We noticed it was not only because the light was originally inside the object, as it was because we were not updating the lights on the display but only when we would turn them on/off. We fixed it by updating the lights on the display function.
