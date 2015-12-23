var canvas;
var entities = [];
var currentEntity;
var posCounter = -1;
var lastPos = { "x": 0, "y": 0 };
var xDragOffset, yDragOffset;
var entitySelected = false;
var snap = 32;

function update()
{
	canvas.fill("#AAAAAA");

	for (var i = 0; i < entities.length; i++)
	{
		entities[i].draw();
	}
}

function playerDraw()
{
	canvas.fillRect(this.x, this.y, this.width, this.height, "#00FF00");
}

function wallDraw()
{
	canvas.fillRect(this.x, this.y, this.width, this.height, "#000000");
}

function enemyDraw()
{
	canvas.fillRect(this.x, this.y, this.width, this.height, "#FF0000");
}

function goalDraw()
{
	canvas.fillRect(this.x, this.y, this.width, this.height, "#FFFF00");
}

function addPlayer()
{
	var player = {};
	player.x = 0;
	player.y = 0;
	player.width = 32;
	player.height = 32;
	player.type = "player";
	player.speed = 0.2;

	player.draw = playerDraw;

	entities.push(player);
}

function addWall()
{
	var wall = {};
	wall.x = 0;
	wall.y = 0;
	wall.width = 32;
	wall.height = 32;
	wall.type = "wall";

	wall.draw = wallDraw;

	entities.push(wall);
}

function addEnemy()
{
	var enemy = {};
	enemy.x = 0;
	enemy.y = 0;
	enemy.width = 32;
	enemy.height = 32;
	enemy.type = "enemy";
	enemy.xVelocity = 0.2;
	enemy.yVelocity = 0;

	enemy.draw = enemyDraw;

	entities.push(enemy);
}

function addGoal()
{
	var goal = {};
	goal.x = 0;
	goal.y = 0;
	goal.width = 32;
	goal.height = 32;
	goal.type = "goal";

	goal.draw = goalDraw;

	entities.push(goal);
}

function pointInRect(x, y, rx, ry, rw, rh)
{
	return !(x <= rx || x >= rx + rw || y <= ry || y >= ry + rh);
}

function setCurrentEntity(i)
{
	if (i === -1)
	{
		$("#edit > div").hide();
		$("#addButtons").show();
		currentEntity = undefined;
		return;
	}

	currentEntity = entities[i];

	$("#editBounds").show();
	$("#editConfirms").show();

	$("#x").val(currentEntity.x);
	$("#y").val(currentEntity.y);
	$("#width").val(currentEntity.width);
	$("#height").val(currentEntity.height);

	if (currentEntity.type === "player")
	{
		$("#editPlayer").show();
		$("#speed").val(currentEntity.speed);
	}
	else
	{
		$("#editPlayer").hide();
	}

	if (currentEntity.type === "enemy")
	{
		$("#editEnemy").show();
		$("#xVelocity").val(currentEntity.xVelocity);
		$("#yVelocity").val(currentEntity.yVelocity);
	}
	else
	{
		$("#editEnemy").hide();
	}
}

function xFromE(e)
{
	var l = $("#canvasContainer").css("left");
	return e.clientX - parseInt(l.substr(0, l.length - 2));
}

function yFromE(e)
{
	return e.clientY;
}

$(function()
{
	$("body").on("contextmenu", "canvas", function(e){ return false; });

	$("#edit > div").hide();
	$("#addButtons").show();

	$("#addPlayer").click(function()
	{
		addPlayer();
		setCurrentEntity(entities.length - 1);
	});

	$("#addEnemy").click(function()
	{
		addEnemy();
		setCurrentEntity(entities.length - 1);
	});

	$("#addWall").click(function()
	{
		addWall();
		setCurrentEntity(entities.length - 1);
	});

	$("#addGoal").click(function()
	{
		addGoal();
		setCurrentEntity(entities.length - 1);
	});

	$("#canvas").mousedown(function(e)
	{
		var x = xFromE(e);
		var y = yFromE(e);

		if (e.button === 0) // left click
		{
			var same = (x === lastPos.x && y === lastPos.y);

			if (!same)
			{
				posCounter = -1;
			}

			lastPos.x = x;
			lastPos.y = y;

			var selected = [];

			for (var i = 0; i < entities.length; i++)
			{
				var en = entities[i];
				if (pointInRect(x, y, en.x, en.y, en.width, en.height))
				{
					selected.unshift(i);
				}
			}

			if (selected.length > 0)
			{
				var i = (++posCounter) % selected.length;
				setCurrentEntity(selected[i]);
				entitySelected = true;
				xDragOffset = x - currentEntity.x;
				yDragOffset = y - currentEntity.y;
			}
		}
		else if (e.button === 2) // right click
		{
			for (var i = 0; i < entities.length; i++)
			{
				var en = entities[i];
				if (pointInRect(x, y, en.x, en.y, en.width, en.height))
				{
					entities.splice(i, 1);
					setCurrentEntity(entities.length - 1);
					break;
				}
			}
		}
	});

	$("#canvas").mousemove(function(e)
	{
		var x = xFromE(e);
		var y = yFromE(e);

		if (entitySelected)
		{
			var nx = parseInt((x - xDragOffset + snap / 2) / snap) * snap;
			var ny = parseInt((y - yDragOffset + snap / 2) / snap) * snap;

			currentEntity.x = nx;
			currentEntity.y = ny;

			$("#x").val(nx);
			$("#y").val(ny);
		}
	});

	$("#canvas").mouseup(function(e)
	{
		var x = xFromE(e);
		var y = yFromE(e);

		entitySelected = false;
	});

	$("#x").change(function()
	{
		currentEntity.x = parseInt($("#x").val());
	});

	$("#y").change(function()
	{
		currentEntity.y = parseInt($("#y").val());
	});

	$("#width").change(function()
	{
		currentEntity.width = parseInt($("#width").val());
	});

	$("#height").change(function()
	{
		currentEntity.height = parseInt($("#height").val());
	});

	$("#xVelocity").change(function()
	{
		currentEntity.xVelocity = parseFloat($("#xVelocity").val());
	});

	$("#yVelocity").change(function()
	{
		currentEntity.yVelocity = parseFloat($("#yVelocity").val());
	});

	$("#speed").change(function()
	{
		currentEntity.speed = parseFloat($("#speed").val());
	});

	$("#snap").change(function(e)
	{
		$(":input[type='number']").attr("step", $("#snap").val());
		$("#speed").attr("step", 0.1);
		$("#xVelocity").attr("step", 0.1);
		$("#yVelocity").attr("step", 0.1);
		$("#snap").attr("step", 4);

		snap = parseInt($("#snap").val());
	});

	$("#levelWidth").change(function(e)
	{
		var v = parseInt($("#levelWidth").val());

		if (!isNaN(v))
		{
			canvas.resize(v, canvas.height());
		}
	});

	$("#levelHeight").change(function(e)
	{
		var v = parseInt($("#levelHeight").val());

		if (!isNaN(v))
		{
			canvas.resize(canvas.width(), v);
		}
	});

	$("#export").click(function()
	{
		var level = {};
		var v = function(id)
		{
			return parseInt($("#" + id).val());
		};

		var vf = function(id)
		{
			return parseFloat($("#" + id).val());
		};

		level.width = v("levelWidth");
		level.height = v("levelHeight");
		level.entities = [];

		for (var i = 0; i < entities.length; i++)
		{
			var e = JSON.parse(JSON.stringify(entities[i]));
			delete e.draw;

			level.entities.push(e);
		}

		$("#exportText").val(JSON.stringify(level));
	});

	$("#import").click(function()
	{
		entities = [];

		var l = JSON.parse($("#exportText").val());

		$("#levelWidth").val(l.width);
		$("#levelHeight").val(l.height);

		canvas.resize(l.width, l.height);

		entities = l.entities;

		for (var i = 0; i < entities.length; i++)
		{
			entities[i].draw = window[entities[i].type + "Draw"];
		}
	});

	canvas = new Canvas(document.getElementById("canvas"));
	setInterval(update, 10);
});