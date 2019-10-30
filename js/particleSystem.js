/* author: Andrew Burks */
"use strict";

/* Get or create the application global variable */
var App = App || {};
const ParticleSystem = function() {

    // setup the pointer to the scope 'this' variable
    const self = this;

    // data container
    const data = [];

    // scene graph group for the particle system
    const sceneObject = new THREE.Group();

    // bounds of the data
    const bounds = {};


    // create the containment box.
    // This cylinder is only to guide development.
    // TODO: Remove after the data has been rendered
    self.drawContainment = function() {

        // get the radius and height based on the data bounds
        const radius = (bounds.maxX - bounds.minX)/2.0 + 1;
        const height = (bounds.maxY - bounds.minY) + 1;

        // create a cylinder to contain the particle system
        const geometry = new THREE.CylinderGeometry( radius, radius, height, 32 );
        const material = new THREE.MeshBasicMaterial( {color: 0xffff00, wireframe: true} );
        const cylinder = new THREE.Mesh( geometry, material );

        // add the containment to the scene
        sceneObject.add(cylinder);
    };

    var greenScale = d3.scaleSequential( d3.interpolateGreens ).domain([0, 30]);
    var greyScale = d3.scaleSequential( d3.interpolateGreys ).domain([0, 30]);

    var PlaneGeometry = new THREE.PlaneGeometry( 12,12 );
    var PlaneMaterial = new THREE.MeshBasicMaterial( {color: 0x00000, side: THREE.DoubleSide, transparent:true, opacity:0.6 } );
    var plane = new THREE.Mesh( PlaneGeometry, PlaneMaterial );
    var particles = new THREE.BufferGeometry();

    // creates the particle system
    self.createParticleSystem = function() {
        $(".scene").html('');
        // var PlaneGeometry = new THREE.PlaneGeometry(12,12);
        // var PlaneMaterial = new THREE.MeshBasicMaterial( {color: 0x00000, side: THREE.DoubleSide, transparent:true, opacity:0.6 } );
        // var plane = new THREE.Mesh( PlaneGeometry, PlaneMaterial );
        // var particles = new THREE.BufferGeometry();
        var color = [];
        var particlepoints = [];

        for(var k = 0 ; k < data.length ; k++ ){
            var col = new THREE.Color();
            col.set( greenScale( data[k].concentration ) );
            // col.push( greenScale( data[k].concentration ) );
            color.push( col.r, col.g, col.b );
            particlepoints.push( data[k].X , data[k].Y , data[k].Z );
        }
        particles.addAttribute( 'position', new THREE.BufferAttribute( new Float32Array(particlepoints), 3 ) );
        particles.addAttribute( 'color', new THREE.BufferAttribute( new Float32Array(color), 3 ) );

        var particlematerial = new THREE.PointsMaterial( { vertexColors: THREE.VertexColors, opacity:0.6, transparent:true, size:0.12 } );
        var plots = new THREE.Points( particles, particlematerial );

        plots.position.y=-5;
        // plots.position.z=10;
        sceneObject.add( plots );
        sceneObject.add( plane );
    };

    self.section = function(z) {
        $(".plane").html('');
        var particleArray = [];
        for(var k = 0 ; k < data.length ; k++){
            if( ( data[k].Z >= ( z - 0.05 ) ) && ( data[k].Z < ( z + 0.05 ) ) ){
                // particleArray.push( data[k].X , data[k].Y , data[k].concentration );
                particleArray.push( { "X": data[k].X , "Y": data[k].Y ,"concentration":data[k].concentration } );
            }
        }
        //SVG element for the section of cylinder
        var section = d3.select(".plane").append("svg")
            .attr("width", 500)
            .attr("height", 500);
        var xScale = d3.scaleLinear().range( [ 0, 500 ]);
        var yScale = d3.scaleLinear().range( [ 500, 0 ] );
        xScale.domain( [ bounds.minX, bounds.maxX ] );
        yScale.domain( [ bounds.minY, bounds.maxY ] );

        section.selectAll('circle')
            .data(particleArray)
            .enter()
            .append('circle')
            .attr("r", 3)
            .attr('cx', function(d) { return xScale( d.X ); } )
            .attr('cy', function(d) { return yScale( d.Y ); } )
            .style('fill', function(d) { return greenScale( d.concentration ); } );
    };

    self.grey = function(z) {
        var colours = [];
        for(var k = 0 ; k < data.length ; k++){
            var col = new THREE.Color();
            if( ( data[k].Z >= ( z - 0.05 ) ) && ( data[k].Z < ( z + 0.05 ) ) ){
                col.set( greenScale ( data[k].concentration ) );
                // col.push ( data[k].X , data[k].Y , data[k].concentration );
                colours.push( col.r, col.g, col.b );
            }
            else{
                col.set( greyScale ( data[k].concentration ) );
                colours.push( col.r, col.g, col.b );
            }
        }
        particles.addAttribute( 'color', new THREE.BufferAttribute( new Float32Array(colours), 3 ) );
    };

    self.resetColor = function(z) {
        var colours = [];
        for( var k = 0 ; k < data.length ; k++ ){
            var col = new THREE.Color();
            col.set( greenScale ( data[k].concentration ) );
            colours.push( col.r, col.g, col.b );
        }
        particles.addAttribute( 'color', new THREE.BufferAttribute( new Float32Array(colours), 3 ) );
        plane.position.z=0;
        self.section(0);
        $( "#zSlider" ).slider( 'value',0 );
        $( "#z" ).val(0);
    };

    $("#reset").click(function(){
        self.resetColor();
    });

    $( "#zSlider" ).slider({value: 0,min: -5,max: 5,step: 0.05,
        slide: function( event, z ) {
          plane.position.z = z.value;
          self.section( z.value );
          self.grey( z.value );
          $( "#z" ).val( z.value );
        }
      });
      $( "#z" ).val( $( "#zSlider" ).slider( "value" ) );

    // data loading function
    self.loadData = function(file){

        // read the csv file
        d3.csv(file)
        // iterate over the rows of the csv file
            .row(function(d) {

                // get the min bounds
                bounds.minX = Math.min(bounds.minX || Infinity, d.Points0);
                bounds.minY = Math.min(bounds.minY || Infinity, d.Points2);
                bounds.minZ = Math.min(bounds.minZ || Infinity, d.Points1);

                // get the max bounds
                bounds.maxX = Math.max(bounds.maxX || -Infinity, d.Points0);
                bounds.maxY = Math.max(bounds.maxY || -Infinity, d.Points2);
                bounds.maxZ = Math.max(bounds.maxY || -Infinity, d.Points1);

                // add the element to the data collection
                data.push({
                    // concentration density
                    concentration: Number(d.concentration),
                    // Position
                    X: Number(d.Points0),
                    Y: Number(d.Points2),
                    Z: Number(d.Points1),
                    // Velocity
                    U: Number(d.velocity0),
                    V: Number(d.velocity2),
                    W: Number(d.velocity1)
                });
            })
            // when done loading
            .get(function() {
                // draw the containment cylinder
                // TODO: Remove after the data has been rendered
                // self.drawContainment();

                // create the particle system
                self.createParticleSystem();
                self.section(0);
            });
    };
    // publicly available functions
    self.public = {

        // load the data and setup the system
        initialize: function(file){
            self.loadData(file);
        },

        // accessor for the particle system
        getParticleSystem : function() {
            return sceneObject;
        }
    };

    return self.public;

};
