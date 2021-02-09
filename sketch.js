
var row_input;
var colummn_input;

var generate_button;

var row_amount;
var colummn_amount;

var activated = false;

let middle_x = 0;
let middle_y = 0;

let camera_x;
let camera_y;
let camera_z;

var distance_between_cells = 40;
var distance_between_grids = 50;

let grid_1;
let grid_2;

let drag_x;
let drag_y;

let font;

let cur_zoom = 1;
let pos_x = 0;
let pos_y = 0;

let zoom_speed = 0.5;

let text_size = 40;
let text_margin_x = 6;

const ABC = Array.from(Array(26).keys(), i => String.fromCharCode(i + 65));

function preload() {
  font = loadFont("assets/SourceSansPro-Regular.ttf");
}



//################### SETUP ########################
function setup() {
  createCanvas(windowWidth,windowHeight);
  createElement('h2', 'Number of rows');
  row_input = createInput("8", "number");

  createElement('h2', 'Number of colummns:');
  colummn_input = createInput("8", "number");
  
  generate_button = createButton("Generate")
  generate_button.mousePressed(generate);

  generate();
  
}


//############# Draw ####################
function draw() {
  if(activated){
    scale(cur_zoom);
    translate(-pos_x, -pos_y);
    //camera(camera_x, camera_y, camera_z , camera_x, camera_y, 0, 0, 1, 0);

    background(0);
    print(str(pos_x));
    
    
    draw_grid(grid_1);
    draw_grid(grid_2);
    
  }
 
}


//######### START #############
function generate() {
  
  row_amount = row_input.value();
  colummn_amount = colummn_input.value();
  removeElements();
  
 
  grid_1 = new grid(text_size,distance_between_cells);

 
  middle_x = grid_1.size_x + distance_between_grids/2;
  middle_y = grid_1.size_y/2;

  

 
  //camera_x = middle_x;
  //camera_y = middle_y;
  //camera_z = (height/2.0) / tan(PI*30.0 / 180.0);
  grid_2 = new grid(grid_1.end_x + distance_between_grids+text_size, distance_between_cells);
  let complete_size_x = grid_2.end_x;
  cur_zoom = (width/complete_size_x);

  activated = true;
}

function draw_grid(grid) {
  //######## Drawing setup ##########
  stroke(255);
  
  
  
  //####### Variables ###########
  var grid_end_x = grid.start_x + row_amount * distance_between_cells;
  var grid_end_y = grid.start_y + colummn_amount * distance_between_cells;

  var x_index = grid.start_x;
  var y_index = grid.start_y;

  //####### Draw the grid ########
  textSize(text_size);
  //Rows / x <->
  for(let i = 0; i<=row_amount; i++){
    line(x_index, grid.start_y,x_index,grid_end_y );
    x_index +=distance_between_cells;
    
  }

  //colummns / y <->
  for(let i = 0; i<=colummn_amount; i++){
   
    line(grid.start_x, y_index,grid_end_x,y_index );
    y_index +=distance_between_cells;
  }


  //Text

  textFont(font);
  textAlign(CENTER,BOTTOM);
  textSize(distance_between_cells/2);
  fill(255);
  x_index = grid.start_x + distance_between_cells/2;

  //Rows / x <-> ABC
  for(let i = 0; i<row_amount; i++){

    
    text(ABC[i],x_index,grid.start_y);
    
    x_index +=distance_between_cells;
    
  }

  textAlign(RIGHT,CENTER);
  y_index = grid.start_y + distance_between_cells/2;
  //Colummns / x <-> 123
  for(let i = 0; i<colummn_amount; i++){

    
    text(str(i+1),grid.start_x-text_margin_x,y_index);
    
    y_index +=distance_between_cells;
    
  }


  //######## Draw the content of the cells ############
  for(let i = 0; i< row_amount; i++){

    for(let z = 0; z < colummn_amount; z++){
      if(grid.array[i][z] == null){ //Nothing

        
      } else if(grid.array[i][z]){ //True -> Square
        square(grid.start_x+i*distance_between_cells+1, grid.start_y+z*distance_between_cells+1,distance_between_cells-2);
        
      } else { //False -> Cross
        stroke(150);
        let x1 = grid.start_x+i*distance_between_cells+1;
        let y1 = grid.start_y+z*distance_between_cells+1;
        let x2 = x1+distance_between_cells-2;
        let y2 = y1+distance_between_cells-2;

        line(x1,y1,x2,y2);
        line(x1,y2,x2,y1);
      }

    }

  }



}


class grid {

  constructor(_x,_y){
    this.start_x = _x;
    this.start_y = _y;
    this.array = [];
    for(let x = 0; x < row_amount; x++){
      this.array[x] = [];
      for(let y = 0; y < colummn_amount; y++){
        this.array[x][y] = null;
      }
    }
    this.end_x = this.start_x + distance_between_cells * row_amount;
    this.end_y = this.start_y + distance_between_cells * colummn_amount;

  }

  
  
}



function toggle(grid){

  let x_dif = (relmouseX() - grid.start_x);
  let y_dif = (relmouseY() - grid.start_y);

  let _x = div( x_dif, distance_between_cells);
  let _y = div( y_dif, distance_between_cells);
  
  if( (x_dif >= 0) && (y_dif >= 0) && (_x < row_amount) && (_y < colummn_amount) ) {
    if(grid.array[_x][_y] == null){
      grid.array[_x][_y] = false;
    } else if (grid.array[_x][_y] == false){
      grid.array[_x][_y] = true;
    } else {
      grid.array[_x][_y] = null;
    }
  }
}

function div(_value,_div){
  let res = _value/_div;
  return int(res);

}


//######### Input #########


function mousePressed(){


  if(activated){

    if(mouseButton == LEFT){
      toggle(grid_1);
      toggle(grid_2);
    } else if(mouseButton == RIGHT){
        drag_x = relmouseX();
        drag_y = relmouseY();
    }

  }
}

function mouseDragged(){

  if(activated){
    if(mouseButton == RIGHT){
      pos_x += drag_x - relmouseX();
      pos_y += drag_y - relmouseY();
      drag_x = relmouseX();
      drag_y = relmouseY();
    }
    
  }
  
}

function mouseWheel(){
  cur_zoom -= event.delta*0.001;
  
}

function relmouseX(){
  
  return pos_x + mouseX/cur_zoom;
}

function relmouseY(){
  return pos_y + mouseY/cur_zoom;
}





