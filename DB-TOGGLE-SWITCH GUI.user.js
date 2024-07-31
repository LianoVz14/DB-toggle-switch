// ==UserScript==
// @name         Draggable GUI with Minimize, Restore, Credits, and Toggle Image
// @namespace    http://tampermonkey.net/
// @version      1.18
// @description  Adds a styled, draggable GUI container with minimize, restore, credits button, and a toggle image switch to the page
// @author       You
// @match        *://*/*
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    let container, minimizedIndicator, creditsTab, openButton, toggleImage;
    let isDragging = false;
    let isSwitchOn = false;

    // Function to add custom CSS styles
    function addStyles() {
        GM_addStyle(`
            #my-enhanced-gui-container {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 350px;
                height: 250px;
                padding: 20px;
                background-color: #2e2e2e;
                border: 3px solid #444;
                border-radius: 12px;
                box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
                z-index: 1000;
                font-family: Arial, sans-serif;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                cursor: move;
                transition: opacity 0.5s, visibility 0.5s;
            }
            #my-enhanced-gui-container.hidden {
                opacity: 0;
                visibility: hidden;
            }
            .gui-header {
                width: 100%;
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding-bottom: 10px;
                position: relative;
                box-sizing: border-box;
            }
            .gui-header button {
                background: linear-gradient(135deg, #4a4a4a, #2e2e2e);
                border: none;
                color: #fff;
                font-size: 16px;
                cursor: pointer;
                padding: 8px 16px;
                border-radius: 8px;
                transition: background 0.3s, transform 0.1s;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            }
            .gui-header button:hover {
                background: linear-gradient(135deg, #5a5a5a, #3e3e3e);
            }
            .gui-header button:active {
                transform: scale(0.95);
                background: linear-gradient(135deg, #6a6a6a, #4e4e4e);
            }
            .gui-content {
                width: 100%;
                height: calc(100% - 50px);
                display: flex;
                justify-content: center;
                align-items: center;
                background: #1e1e1e;
                border-radius: 8px;
                box-sizing: border-box;
                transition: opacity 0.5s;
            }
            #toggle-image {
                width: 100px;  /* Adjust the width as needed */
                height: 170px; /* Adjust the height as needed */
                cursor: pointer;
                position: absolute; /* Ensure the image is positioned absolutely within its container */
                top: 58%;  /* Adjust the vertical position */
                left: 20%; /* Adjust the horizontal position */
                transform: translate(-50%, -50%); /* Center the image */
            }
            #minimized-indicator {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 60px;
                height: 60px;
                background-color: #444;
                border: 2px solid #666;
                border-radius: 8px;
                display: none;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                color: #fff;
                font-size: 24px;
                text-align: center;
                transition: background 0.3s, transform 0.2s;
            }
            #minimized-indicator:hover {
                background-color: #555;
            }
            #minimized-indicator:active {
                transform: scale(0.95);
                background-color: #666;
            }
            #credits-tab {
                position: fixed;
                width: 350px;
                height: 200px;
                background-color: #333;
                border: 2px solid #444;
                border-radius: 8px;
                box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
                z-index: 1001;
                font-family: Arial, sans-serif;
                display: none;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 20px;
                transition: opacity 0.5s, visibility 0.5s;
            }
            #credits-tab.visible {
                display: flex;
                opacity: 1;
                visibility: visible;
            }
            #credits-tab.hidden {
                opacity: 0;
                visibility: hidden;
            }
            #credits-tab .back-button {
                position: absolute;
                top: 10px;
                right: 10px;
                background: linear-gradient(135deg, #4a4a4a, #2e2e2e);
                border: none;
                color: #fff;
                font-size: 18px;
                cursor: pointer;
                padding: 8px 16px;
                border-radius: 8px;
                transition: background 0.3s, transform 0.1s;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            }
            #credits-tab .back-button:hover {
                background: linear-gradient(135deg, #5a5a5a, #3e3e3e);
            }
            #credits-tab .back-button:active {
                transform: scale(0.95);
                background: linear-gradient(135deg, #6a6a6a, #4e4e4e);
            }
            #open-button {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 100px;
                height: 40px;
                background-color: #444;
                border: 2px solid #666;
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                color: #fff;
                font-size: 18px;
                text-align: center;
                transition: background 0.3s, transform 0.2s;
                font-family: Arial, sans-serif;
            }
            #open-button:hover {
                background-color: #555;
            }
            #open-button:active {
                transform: scale(0.95);
                background-color: #666;
            }
        `);
    }

    // Function to create or show the GUI container
    function createOrShowGUI() {
        if (!container) {
            container = document.createElement('div');
            container.id = 'my-enhanced-gui-container';

            let header = document.createElement('div');
            header.className = 'gui-header';

            let minimizeButton = document.createElement('button');
            minimizeButton.innerHTML = '−';
            minimizeButton.title = 'Minimize';
            minimizeButton.addEventListener('click', () => {
                console.log('Minimize button clicked');
                container.classList.toggle('hidden');
                minimizedIndicator.style.display = container.classList.contains('hidden') ? 'flex' : 'none';
            });

            let creditsButton = document.createElement('button');
            creditsButton.innerHTML = 'Credits';
            creditsButton.title = 'Credits';
            creditsButton.addEventListener('click', () => {
                console.log('Credits button clicked');
                showCreditsTab();
            });

            header.appendChild(minimizeButton);
            header.appendChild(creditsButton);

            let mainContent = document.createElement('div');
            mainContent.className = 'gui-content';

            toggleImage = document.createElement('img');
            toggleImage.id = 'toggle-image';
            toggleImage.src = 'https://i.postimg.cc/XYq51p48/Toggle-sw-itches-1.png';
            toggleImage.alt = 'Toggle Image';
            toggleImage.addEventListener('click', toggleSwitch);

            mainContent.appendChild(toggleImage);

            container.appendChild(header);
            container.appendChild(mainContent);

            document.body.appendChild(container);

            makeDraggable(container);
        } else {
            container.classList.remove('hidden');
            minimizedIndicator.style.display = 'none';
        }
    }

    // Function to toggle the switch image
    function toggleSwitch() {
        if (isSwitchOn) {
            toggleImage.src = 'https://i.postimg.cc/XYq51p48/Toggle-sw-itches-1.png';
        } else {
            toggleImage.src = 'https://i.postimg.cc/YCPW5MSw-/Toggle-sw-itches-2.png';
        }
        isSwitchOn = !isSwitchOn;
    }

    // Function to create the minimized indicator
    function createMinimizedIndicator() {
        minimizedIndicator = document.createElement('div');
        minimizedIndicator.id = 'minimized-indicator';
        minimizedIndicator.innerHTML = '☰';
        minimizedIndicator.title = 'Restore GUI';
        minimizedIndicator.addEventListener('click', () => {
            console.log('Minimized indicator clicked');
            createOrShowGUI();
        });
        document.body.appendChild(minimizedIndicator);
    }

    // Function to show the credits tab
    function showCreditsTab() {
        if (!creditsTab) {
            creditsTab = document.createElement('div');
            creditsTab.id = 'credits-tab';

            let backButton = document.createElement('button');
            backButton.className = 'back-button';
            backButton.innerHTML = 'Back';
            backButton.title = 'Back to Main GUI';
            backButton.addEventListener('click', hideCreditsTab);

            creditsTab.appendChild(backButton);
            document.body.appendChild(creditsTab);

            // Sync credits tab position with the main GUI container
            syncCreditsTabPosition();
        }

        // Smoothly transition the main GUI out and the credits tab in
        if (container) {
            container.classList.add('hidden');
        }
        creditsTab.classList.add('visible');
        creditsTab.classList.remove('hidden');

        // Sync credits tab position with the main GUI container
        syncCreditsTabPosition();
    }

    // Function to hide the credits tab
    function hideCreditsTab() {
        if (creditsTab) {
            creditsTab.classList.add('hidden');
            creditsTab.classList.remove('visible');
        }
        if (container) {
            container.classList.remove('hidden');
        }
    }

    // Function to sync credits tab position with the main GUI container
    function syncCreditsTabPosition() {
        if (creditsTab && container) {
            let containerRect = container.getBoundingClientRect();
            creditsTab.style.left = `${containerRect.left}px`;
            creditsTab.style.top = `${containerRect.top}px`;
        }
    }

    // Function to create the open button
    function createOpenButton() {
        openButton = document.createElement('div');
        openButton.id = 'open-button';
        openButton.innerHTML = 'Open';
        openButton.title = 'Open GUI';
        openButton.addEventListener('click', () => {
            console.log('Open button clicked');
            createOrShowGUI();
            openButton.style.display = 'none';
        });
        document.body.appendChild(openButton);
    }

    // Function to make an element draggable and keep credits tab in sync
    function makeDraggable(element) {
        let offsetX, offsetY, mouseX, mouseY;

        element.addEventListener('mousedown', function(e) {
            isDragging = true;
            offsetX = e.clientX - parseFloat(getComputedStyle(element).left);
            offsetY = e.clientY - parseFloat(getComputedStyle(element).top);

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        function onMouseMove(e) {
            if (!isDragging) return;

            mouseX = e.clientX;
            mouseY = e.clientY;

            element.style.left = `${mouseX - offsetX}px`;
            element.style.top = `${mouseY - offsetY}px`;

            // Update the credits tab position to match the main GUI container
            syncCreditsTabPosition();
        }

        function onMouseUp() {
            isDragging = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }
    }

    // Initialize GUI, minimized indicator, and open button
    addStyles();
    createOpenButton(); // Create open button on page load
    createMinimizedIndicator();
})();
