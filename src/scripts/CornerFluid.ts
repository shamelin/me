/*
 * Copyright (c) 2023 Simon Hamelin
 *
 * Module name:
 *   CornerFluid.js
 *
 * Abstract:
 *   A CornerFluid component is basically a circle that has Bezier curves and
 *   manipulations, known as bezier curve animation.
 *
 * Author:
 *   Simon Hamelin Sat Jan 07 2023
 *
 * Revision History:
 *
 */

const BUMP_RADIUS: number = 100;
const HALF_PI: number = Math.PI / 2;

export type Position = "bottom-left" | "top-right";

export class CornerFluid {
    position: Position;
    color: string;
    size: number;
    segments: number;
    step: number;

    scaleX: number;
    scaleY: number;

    theta: number = 0;
    thetaRamp: number = 0;
    thetaRampDest: number = 12;
    thetaRampDelta: number = 25;

    wobbleIncrement: number = 0;

    anchors: Array<number> = [];
    radii: Array<number> = [];
    wobbles: Array<number> = [];

    /**
     * This is the main constructor of the CornerFluid class.
     * 
     * @param {string} color The color of the corner fluid.
     * @param {number} size The size of the corner fluid (radius).
     * @param {number} segments The number of segments to create when the fluid
     *                          is created.
     */
    constructor(position: Position, color: string, size: number,
        segments: number, scaleX: number, scaleY: number) {
        this.position = position;
        this.color = color;
        this.size = size;
        this.segments = segments;

        this.scaleX = scaleX;
        this.scaleY = scaleY;

        this.step = Math.PI / (2 * this.segments);

        // For all the segments plus for the start and end, we will initialize
        // the "anchors" variable and then insert a random radius for the bezier
        // curve in the "radii" variable.
        // We will do the same in the "wobbles" variable.

        for (let i = 0; i < this.segments + 2; i++) {
            this.anchors.push(i * this.step);
            this.radii.push(Math.random() * BUMP_RADIUS - (BUMP_RADIUS / 2));
            this.wobbles.push(Math.random() * 2 * Math.PI);
        }
    }

    /**
     * Updates the image of the corner fluid.
     * This will also update the local variables of the current instance.
     * Execute this function multiple times to get a smooth animation.
     */
    update(c: CanvasRenderingContext2D) {
        this.theta += 0.03;
        this.thetaRamp += (this.thetaRampDest - this.thetaRamp) / this.thetaRampDelta;

        // We recalculate the wobbles for each segment.
        this.anchors = [];
        for (let i = 0; i <= this.segments + 2; i++) {
            const angle = Math.sin(this.wobbles[i] + this.theta + this.thetaRamp);

            const rad = this.size + this.radii[i] * angle;
            const theta = this.step * i;

            const x = rad * Math.cos(theta);
            const y = rad * Math.sin(theta);

            switch (this.position) {
                case "bottom-left":
                    this.anchors.push(x, -y);
                    break;

                case "top-right":
                    this.anchors.push(-x, y);
                    break;
            }
        }

        c.save();

        switch (this.position) {
            case "bottom-left":
                c.translate(0, window.innerHeight + 10);
                break;

            case "top-right":
                c.translate(window.innerWidth + 10, 0);
                break;
        }

        c.scale(this.scaleX, this.scaleY);
        c.fillStyle = this.color;
        c.beginPath();
        c.moveTo(0, 0);

        // We draw the bezier curve
        this.drawBezierCurve(c, this.anchors);

        c.lineTo(0, 0);
        c.fill();
        c.restore();
    }

    /**
     * Returns the anchors of the corner fluid.
     * 
     * @returns {Array<number>} The anchors of the corner fluid.
     */
    getAnchors(): Array<number> {
        return this.anchors;
    }

    /**
     * Calculates the average of the control points received in parameter.
     * 
     * @param {number[]} points The control points.
     * @return {number[]} The average table of the control points.
     */
    average(points: number[]): number[] {
        const average: number[] = [];
        let previous;

        for (let i: number = 2; i < points.length; i++) {
            previous = i - 2;
            average.push((points[previous] + points[i]) / 2);
        }

        average.push(
            (points[0] + points[points.length - 2]) / 2,
            (points[1] + points[points.length - 1]) / 2
        );

        return average;
    }

    /**
     * Draws the bezier curve on the canvas.
     * 
     * @param {number[]} points The control points.
     */
    drawBezierCurve(c: CanvasRenderingContext2D, points: number[]) {
        const average: number[] = this.average(points);

        c.moveTo(points[0], points[1]);
        c.lineTo(average[0], average[1]);

        for (let i: number = 2; i < points.length - 2; i += 2) {
            c.quadraticCurveTo(
                points[i],
                points[i + 1],
                average[i],
                average[i + 1]
            );
        }

        c.lineTo(
            points[points.length - 2],
            points[points.length - 1]
        );
    }
}
