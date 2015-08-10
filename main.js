var data = [[1,40,50],[2,45,55],[3,50,60], [4,45,50],[5,50,55],[6,40,45], [7,50,55],[8,50,60],[9,60,65], [10,40,45],[11,50,60],[12,45,60], [13,50,55],[14,55,60],[15,60,65], [16,45,50],[17,55,60],[18,60,70], [19,65,65],[20,60,65],[21,50,55], [22,45,50],[23,50,60],[24,55,65], [25,60,65],[26,55,65],[27,40,50], [28,45,50],[29,50, 55],[30,60, 58], [31,70,60]];

var g = new Dygraph(document.getElementById('graph'),
		data,
		{
			legend: 'follow',
			animatedZooms: true,
            height: 200,
			axes: {
				y: {
					valueRange: [5, 100]
				}
			},
			series: {
					'Expected Performance %': {
					color: '#2EA067',
					strokeWidth: 3,
				},
				'Actual Performance %': {
					color: '#BCE7B5',
					strokeWidth: 3
				}
			},
			rollPeriod: 0,
			visibility: [false, false], //so it doesnt show on load.
			labels: ['No.', 'Expected Performance %', 'Actual Performance %'],
			drawCallback: function(dygraph, initial){
				if (initial){
					animate(data, dygraph); //call this on initial to animate it in.
				}
			}
		}
);

function animate(d, dygraph){
	// SETUP
	var steps = 40; //no of increments
	var fps = false; //fps: auto if false.
	
	//----------------------------
	//clone function
	Array.prototype.clone = function() {
		return JSON.parse(JSON.stringify(this));
	};
	//----------------------------
	// this seems a nice speed.
	if (!fps) fps = steps * 2.5;
	var first = true;
	var oD = d.clone();
	var i,x,nDP,clear,opts;
	for(i=0;i<d.length;i++){
		for(x=0;x<d[i].length;x++){
			if (x!==0) d[i][x] = (d[i][x]/steps)*2;
		}
	}
	var interval = setInterval(function(){
		//increase the d points.
		for(i=0;i<d.length;i++){
			for(x=0;x<d[i].length;x++){
				if (x!==0){
					nDP = d[i][x]+(oD[i][x]/steps);
					if (nDP <= oD[i][x]) {
						//leave gaps.
						if (nDP===0) d[i][x] = null;
						else d[i][x] = nDP;
					}
					else{
						d[i][x] = oD[i][x];
						clear = true;
					}
				}
			}
		}
		if (clear){
			//backup to ensure the correct data 
			//is shown at the end if js is slow.
			dygraph.updateOptions({'file':oD});
			clearInterval(interval);
		}
		//set the options
		opts = {'file': d};
		if (first){
			opts.visibility = [true, true];
			first = false;
		}
		//render the chart again
		dygraph.updateOptions(opts);
	}, 1000 / fps);
};
                 
