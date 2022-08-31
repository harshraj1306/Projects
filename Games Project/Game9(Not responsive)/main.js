// Interactive container

const game = $('.game_inner__elements');

// Burger ingredients elements

const ingredients = game.find('div.ingredient');

var currentIngredients = new Array();

// Score element

const scoreElement = $('.game_inner__score span');
const scoreMax = 10;
const scoreMin = 7.50;

var score = 0;

var difficulty = 2;

// Round timer

var roundTime = 90;
const roundTimeElement = $('.game_inner__timer span');



// Till element

const till = game.find('.till');

// Burger element

const burger = game.find('.burger');

// Order element

const orderElement = $('.game_inner__order');

// Create burger stack

function createOrder(difficulty) {
    let order_ingredients = [
        'tomato',
        'lettuce',
        'cheese',
        'ketchup',
        'mustard',
        'patty'
    ];

    let burger_stack = [];

    for(let i = 0; i < difficulty; i++){
        let rand = Math.floor(Math.random() * Math.floor(order_ingredients.length));
        burger_stack.push(order_ingredients[rand]);
    }

    if($.inArray('patty', burger_stack) < 0){
        let rand = Math.floor(Math.random() * Math.floor(burger_stack.length - 1));
        burger_stack.splice(rand, 1, 'patty');   
    }

    burger_stack = {ingredients: burger_stack.join(',')};

    return burger_stack;
}

// Get order and display


function getOrder(order) {
    let currentOrder = order.ingredients.split(',');
    orderElement.find('.order').append('<p>Yes, I would like...</p><br/>')
    currentOrder.forEach(function(ingredient) {
        orderElement.find('.order').append(`<p><span class="${ingredient}"></span> ${ingredient} </p>`);
    });
}

function nextOrder(size) {
    currentIngredients = new Array();
    setTimeout(function(){
        $('.car').css('left', '700px');
    },1)
    setTimeout(function(){
        $('.car').css('transition', 'all 0s');
        $('.car').css('left', '-700px');
    },300)

    setTimeout(function(){
        $('.car').css('transition', 'all 0.3s');
        $('.car').css('left', '0px');
    },1000)

    burger.fadeOut(function(){
        burger.html('<img class="top" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/217233/gb_bun_top.png"><img class="bottom" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/217233/gb_bun_bottom.png">');  
        burger.fadeIn()
    })

    orderElement.find('.order').fadeOut(function(){
        orderElement.find('.order').fadeIn();
        orderElement.find('.order').html('');
        newOrder = createOrder(size)
        getOrder(newOrder);
    });

}


$('.restart').click(function(){
    burger.fadeOut(function(){
        burger.html('<img class="top" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/217233/gb_bun_top.png"><img class="bottom" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/217233/gb_bun_bottom.png">');  
        burger.fadeIn();
        currentIngredients = []
    })
})

nextOrder(difficulty);

// Bind ingredients click

ingredients.click(function() {
    let clickedIngredient = $(this).attr('class').split(' ')[0];

    let clickedIngredientEl = `<div class="burger_${clickedIngredient}">
<img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/217233/gb_burger_${clickedIngredient}.png"></div>`;

    add(clickedIngredient, clickedIngredientEl);
})

// Add ingredients to burger

function add(ingredient, ingredientEl) {

    burger.append(ingredientEl);
    currentIngredients.push(ingredient);
}


// Check if ingredients match the order

function checkIngredients(ingredients, order) {
    let a = ingredients.toString();
    let b = order.toString();

    if(a===b) {
        return 'Perfect';
    }

    let ingredientsAmt = ingredients.reduce(function(countMap, word) { countMap[word] = ++countMap[word] || 1; return countMap }, {});
    let orderAmt = order.reduce(function(countMap, word) { countMap[word] = ++countMap[word] || 1; return countMap }, {});
    let count = 0;

    for(let i in orderAmt) {
        if(typeof ingredientsAmt[i] !== "undefined" && orderAmt[i] === ingredientsAmt[i]) {
            count += orderAmt[i];
        }
        if(count == order.length) {
            return 'Not Bad';
        }
    }

    return 'No Good';
}

// Check order and get the next one when till is clicked

till.click(function() {
    let checkOrder = newOrder.ingredients.split(',');
    let result = checkIngredients(currentIngredients, checkOrder);

    if(result == 'Perfect') {

        score = score + scoreMax;
    }

    if(result == 'Not Bad') {
        score = score + scoreMin;    
    }
    $('.game_inner__result').fadeIn();
    $('.game_inner__result').html(result)

    setTimeout(function(){
        $('.game_inner__result').fadeOut();
    },300)

    scoreElement.html(`$${score}`);

    nextOrder(difficulty);
});

var gameStarted = false;

$('button').click(function(){
    gameStarted = true;
    $(this).parent().hide().prev().hide();
    roundTimer();
})

function roundTimer() {
    console.log(roundTime)

    setInterval(function() {
        if(roundTime > 1) {
            roundTime --;
            roundTimeElement.html(roundTime); 

            if(score > 10) {
                difficulty = 3
            }

            if(score > 30) {
                difficulty = 4
            }

            if(score > 70) {
                difficulty = 5
            }
            if(score > 120) {
                difficulty = 6
            }
            if(score > 170) {
                difficulty = 7
            }
        } else {
            $('.game_inner__end').show();
            $('.game_inner__overlay').show();
            $('.game_inner__end p').html(`Good Job. You helped Ed make $${score} today.`);

        }
    },1000);


}



'use strict';

///console.clear();

class Grain {
    constructor (el) {
        /**
     * Options
     * Increase the pattern size if visible pattern
     */
        this.patternSize = 150;
        this.patternScaleX = 1;
        this.patternScaleY = 1;
        this.patternRefreshInterval = 3; // 8
        this.patternAlpha = 28; // int between 0 and 255,

        /**
     * Create canvas
     */
        this.canvas = el;
        this.ctx = this.canvas.getContext('2d');
        this.ctx.scale(this.patternScaleX, this.patternScaleY);

        /**
     * Create a canvas that will be used to generate grain and used as a
     * pattern on the main canvas.
     */
        this.patternCanvas = document.createElement('canvas');
        this.patternCanvas.width = this.patternSize;
        this.patternCanvas.height = this.patternSize;
        this.patternCtx = this.patternCanvas.getContext('2d');
        this.patternData = this.patternCtx.createImageData(this.patternSize, this.patternSize);
        this.patternPixelDataLength = this.patternSize * this.patternSize * 4; // rgba = 4

        /**
     * Prebind prototype function, so later its easier to user
     */
        this.resize = this.resize.bind(this);
        this.loop = this.loop.bind(this);

        this.frame = 0;

        window.addEventListener('resize', this.resize);
        this.resize();

        window.requestAnimationFrame(this.loop);
    }

    resize () {
        this.canvas.width = window.innerWidth * devicePixelRatio;
        this.canvas.height = window.innerHeight * devicePixelRatio;
    }

    update () {
        const {patternPixelDataLength, patternData, patternAlpha, patternCtx} = this;

        // put a random shade of gray into every pixel of the pattern
        for (let i = 0; i < patternPixelDataLength; i += 4) {
            // const value = (Math.random() * 255) | 0;
            const value = Math.random() * 255;

            patternData.data[i] = value;
            patternData.data[i + 1] = value;
            patternData.data[i + 2] = value;
            patternData.data[i + 3] = patternAlpha;
        }

        patternCtx.putImageData(patternData, 0, 0);
    }

    draw () {
        const {ctx, patternCanvas, canvas, viewHeight} = this;
        const {width, height} = canvas;

        // clear canvas
        ctx.clearRect(0, 0, width, height);

        // fill the canvas using the pattern
        ctx.fillStyle = ctx.createPattern(patternCanvas, 'repeat');
        ctx.fillRect(0, 0, width, height);
    }

    loop () {
        // only update grain every n frames
        const shouldDraw = ++this.frame % this.patternRefreshInterval === 0;
        if (shouldDraw) {
            this.update();
            this.draw();
        }

        window.requestAnimationFrame(this.loop);
    }
}


/**
 * Initiate Grain
 */
const el = document.querySelector('.grain');
const grain = new Grain(el);

// Tut overlay
// Ending screen    