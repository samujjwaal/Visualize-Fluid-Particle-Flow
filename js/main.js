"use strict";

/* Get or create the application global variable */
var App = App || {};

/* IIFE to initialize the main entry of the application*/
(function() {

    // setup the pointer to the scope 'this' variable
    var self = this;

    /* Entry point of the application */
    App.start = function()
    {
        // create a new scene, pass options as dictionary
        App.scene = new Scene({container:"scene"});

        // initialize the particle system
        const particleSystem = new ParticleSystem();
        particleSystem.initialize('git/data/050.csv');

        //add the particle system to the scene
        App.scene.addObject( particleSystem.getParticleSystem());

        // render the scene
        App.scene.render();

    };

}) ();