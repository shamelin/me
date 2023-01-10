/*
 * Copyright (c) 2023 Simon Hamelin
 *
 * Module name:
 *   Background.ts
 *
 * Abstract:
 *   No description provided.
 *
 * Author:
 *   Simon Hamelin Sat Jan 07 2023
 *
 * Revision History:
 *
 */

import type { CornerFluid } from "./CornerFluid";

export class Background {
    canvas: HTMLCanvasElement;
    c: CanvasRenderingContext2D | null;
    elements: CornerFluid[] = [];

    hueGradientStart: number = 215;
    hueGradientEnd: number = 225;
    gradient?: CanvasGradient;

    /**
     * Constructor of the Background class.
     * This will create a new canvas element and append it to the body.
     * 
     * It will also create two CornerFluid components, one for the bottom left
     * and one for the top right.
     */
    constructor() {
        this.canvas = document.createElement("canvas");
        this.c = this.canvas.getContext("2d");
        this.canvas.id = "background";

        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        this.gradient = this.c?.createLinearGradient(0, this.canvas.height, this.canvas.width, 0);
        this.gradient?.addColorStop(0, `#283593`);
        this.gradient?.addColorStop(1, `#3f51b5`);

        document.body.appendChild(this.canvas);
    }

    /**
     * Adds a corner fluid to the background.
     * 
     * @param cornerFluid The corner fluid to add.
     */
    addElement(element: CornerFluid) {
        this.elements.push(element);
    }

    /**
     * This will draw the background on the canvas in a loop.
     * The function will also be added to the function "requestAnimationFrame"
     * to refresh indefinitely.
     */
    draw() {
        if (!this.c) return;

        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        this.c.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.gradient) {
            this.c.fillStyle = this.gradient;
            this.c.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }

        for (let i = 0; i < this.elements.length; i++) {
            this.elements[i].update(this.c);
        }

        window.requestAnimationFrame(() => this.draw());
    }
}
