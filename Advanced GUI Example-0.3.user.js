// ==UserScript==
// @name         Advanced GUI Example
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Create an advanced GUI using Userscript
// @author       Your Name
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Add styles for the GUI
    const styles = `
        #customGuiContainer {
            position: fixed;
            top: 10px;
            right: 10px;
            width: 300px;
            background-color: white;
            border: 1px solid black;
            padding: 10px;
            z-index: 10000;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
            border-radius: 5px;
            font-family: Arial, sans-serif;
            resize: both;
            overflow: auto;
        }
        #customGuiHeader {
            cursor: move;
            background-color: #f1f1f1;
            padding: 10px;
            border-bottom: 1px solid #ddd;
            text-align: center;
            font-weight: bold;
            position: relative;
        }
        #customGuiClose {
            position: absolute;
            top: 5px;
            right: 10px;
            cursor: pointer;
            color: red;
            font-size: 16px;
            font-weight: bold;
        }
        #customGuiButton {
            display: block;
            width: 100%;
            padding: 10px;
            margin-top: 10px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
        }
        #customGuiButton:hover {
            background-color: #45a049;
        }
        #customGuiTextarea {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 3px;
            margin-top: 10px;
        }
        #colorPicker {
            margin-top: 10px;
            width: 100%;
        }
        #sliderContainer {
            margin-top: 10px;
        }
        #slider {
            width: 100%;
        }
    `;

    // Inject styles into the document
    const styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // Create the GUI container
    const container = document.createElement('div');
    container.id = 'customGuiContainer';
    document.body.appendChild(container);

    // Create the header for dragging
    const header = document.createElement('div');
    header.id = 'customGuiHeader';
    header.innerHTML = 'Advanced GUI <span id="customGuiClose">&times;</span>';
    container.appendChild(header);

    // Create a button
    const button = document.createElement('button');
    button.id = 'customGuiButton';
    button.innerText = 'Click Me';
    container.appendChild(button);

    // Create a text area
    const textArea = document.createElement('textarea');
    textArea.id = 'customGuiTextarea';
    textArea.rows = 5;
    container.appendChild(textArea);

    // Create a color picker
    const colorPicker = document.createElement('input');
    colorPicker.type = 'color';
    colorPicker.id = 'colorPicker';
    container.appendChild(colorPicker);

    // Create a slider
    const sliderContainer = document.createElement('div');
    sliderContainer.id = 'sliderContainer';
    const sliderLabel = document.createElement('label');
    sliderLabel.innerText = 'Adjust me: ';
    sliderContainer.appendChild(sliderLabel);
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.id = 'slider';
    slider.min = '0';
    slider.max = '100';
    slider.value = '50';
    sliderContainer.appendChild(slider);
    container.appendChild(sliderContainer);

    // Add button click event
    button.addEventListener('click', () => {
        textArea.value = 'Hello, world!';
    });

    // Add color picker change event
    colorPicker.addEventListener('input', (e) => {
        container.style.backgroundColor = e.target.value;
    });

    // Add slider change event
    slider.addEventListener('input', (e) => {
        textArea.style.fontSize = `${e.target.value}px`;
    });

    // Close button functionality
    const closeButton = document.getElementById('customGuiClose');
    closeButton.addEventListener('click', () => {
        container.style.display = 'none';
    });

    // Make the GUI draggable
    let isDragging = false;
    let startX, startY, initialX, initialY;

    header.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        initialX = container.offsetLeft;
        initialY = container.offsetTop;
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });

    function onMouseMove(e) {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        container.style.left = `${initialX + dx}px`;
        container.style.top = `${initialY + dy}px`;
    }

    function onMouseUp() {
        isDragging = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    }

    // Save and restore position
    const savedPosition = localStorage.getItem('guiPosition');
    if (savedPosition) {
        const [left, top] = savedPosition.split(',').map(Number);
        container.style.left = `${left}px`;
        container.style.top = `${top}px`;
    }

    // Update position in localStorage on move
    document.addEventListener('mousemove', () => {
        if (isDragging) {
            localStorage.setItem('guiPosition', `${container.offsetLeft},${container.offsetTop}`);
        }
    });
})();
