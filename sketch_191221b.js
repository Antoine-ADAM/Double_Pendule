let repere;
let reperex2;
let m1;
let m2;
let mr;
let l1;
let l2;
let aa=3.14;
let ab=-0.2;
let ba=3.14;
let bb=2;
const g=50;
const step=0.03;
const zo=2;
let xa;
let ya;
let xb;
let yb;
function setup() {
m1=m2=l1=l2=50;
mr=m2/(m1+m2);
createCanvas(windowWidth, windowHeight);
repere=createVector(width/4, height/2);
angleMode(RADIANS);
reperex2=width/2;
//angleMode(DEGREES);
xa=Math.sin(aa)*l1*zo+repere.x;
ya=Math.cos(aa)*l1*zo+repere.y;
xb=Math.sin(ba)*l2*zo+xa;
yb=Math.cos(ba)*l2*zo+ya;
fill("#EBA154");
textSize(16);
textAlign(CENTER);
text("© Antoine ADAM",width/2, 20);
}


function draw() {
    noStroke();
    fill("#FFFFFF");
    circle(repere.x,repere.y,repere.x);
    fill(255,255,255,5);
    circle(reperex2+repere.x,repere.y,repere.x);
    resulte=simulationstep(aa,ab,ba,bb);
    aa=resulte[0];
    ab=resulte[1];
    ba=resulte[2];
    bb=resulte[3];
    if(mouseIsPressed){
        aa=Math.atan((mouseX-repere.x)/(mouseY-repere.y));
        strokeWeight(1);
        text("aa=>"+aa,50,50);
    }
    //scr=(millis()%1000)/100;
    print(resulte);
    const txa=xa;
    const tya=ya;
    const txb=xb;
    const tyb=yb;
    xa=Math.sin(aa)*l1*zo+repere.x;
    ya=Math.cos(aa)*l1*zo+repere.y;
    xb=Math.sin(ba)*l2*zo+xa;
    yb=Math.cos(ba)*l2*zo+ya;
    noFill();
    strokeWeight(1);
    stroke("red");
    line(txb+reperex2,tyb,xb+reperex2,yb);
    stroke('green');
    line(txa+reperex2,tya,xa+reperex2,ya);
    strokeWeight(3*zo);
    stroke("#E87DE3");
    line(repere.x,repere.y,xa,ya);
    stroke("#8ABCFF");
    line(xa,ya,xb,yb);
    strokeWeight(6*zo);
    stroke("blue");
    point(repere.x,repere.y);
    stroke("red");
    point(xb,yb);
    stroke("green");
    point(xa,ya);
}
function simulationstep(y1, yp1, y2, yp2){
    
    
    //Ã©nergie
    
    // let m2 = 1;
    // let m1 = (1 - mr)/mr;
    // m2 /= m1;
    // m1 = 1;
    // if (mr == 0)
    // {
    // 	m2 = 0;
    // 	m1 = 1;
    // }
    
    let edc = 1/2*m1*l1**2*yp1**2+1/2*m2*(l1**2*yp1**2+l2**2*yp2**2+2*l1*l2*yp1*yp2*Math.cos(y1-y2));
    let edp = -(m1+m2)*g*l1*Math.cos(y1)-m2*g*l2*Math.cos(y2);


    /*
      l1 theta1.. + mr l2 theta2.. cos(theta1 - theta2) + mr l2 theta2.^2 sin(theta1 - theta2) + g sin(theta1) = 0
      
      l1 theta1.. cos(theta1 - theta2) + l2 theta2.. - l1 theta1.^2 sin(theta1 - theta2)+g sin(theta2) = 0
     */

    /*
      a11 y1.. + a12 y2.. = sm1
      a21 y1.. + a22 y2.. = sm2
     */


    //let ec0 = 1/2*1*l1**2*yp1**2;
    //let ep0 = -(1)*g*l1*Math.cos(y1);
    
    {
	let sm1 = -mr*l2*yp2**2*Math.sin(y1-y2)-g*Math.sin(y1);
	let sm2 = l1*yp1**2*Math.sin(y1-y2)-g*Math.sin(y2);
	let a11 = l1;
	let a12 = mr*l2*Math.cos(y1-y2);
	let a21 = l1*Math.cos(y1-y2);
	let a22 = l2;
	
	let delta = (a11*a22-a21*a12);

	let ypp1 = (sm1*a22-sm2*a12)/delta;
	let ypp2 = (a21*sm1-a11*sm2)/(-delta);

	
	var fy1 = yp1;
	var fy2 = yp2;
	var fyp1 = ypp1;
	var fyp2 = ypp2;

    }
    {
	let sm1 = -mr*l2*fyp2**2*Math.sin(fy1-fy2)-g*Math.sin(fy1);
	let sm2 = l1*fyp1**2*Math.sin(fy1-fy2)-g*Math.sin(fy2);
	let a11 = l1;
	let a12 = mr*l2*Math.cos(fy1-fy2);
	let a21 = l1*Math.cos(fy1-fy2);
	let a22 = l2;
	
	let delta = (a11*a22-a21*a12);


	
	let ypp1 = (sm1*a22-sm2*a12)/delta;
	let ypp2 = (a21*sm1-a11*sm2)/(-delta);

	
	var ftoty1 = fy1+0.5*step*fyp1;
	var ftoty2 = fy2+0.5*step*fyp2;
	var ftotyp1 = fyp1+0.5*(step*ypp1);
	var ftotyp2 = fyp2+0.5*(step*ypp2);


    }

    
    //Schéma du point moitiÃ©
    
    y1=y1+step*ftoty1;
    yp1=yp1+step*ftotyp1;

    y2=y2+step*ftoty2;
    yp2=yp2+step*ftotyp2;


    //énergie
    
    let ec = 1/2*m1*l1**2*yp1**2+1/2*m2*(l1**2*yp1**2+l2**2*yp2**2+2*l1*l2*yp1*yp2*Math.cos(y1-y2));
    let ep = -(m1+m2)*g*l1*Math.cos(y1)-m2*g*l2*Math.cos(y2);

    //let deltae = (ec+ep)-(edc+edp);

    /*
    if (k < .2)
	print(deltae/(ec+ep));
    */
    
    
    
    return [y1, yp1, y2, yp2, ep+ec, edc+edp];
    
}

