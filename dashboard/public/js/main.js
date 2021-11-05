// tsparticles config
// ts particles is a lot better that particles js when it comes to performance
tsParticles
  .load("tsparticles", {
    "fpsLimit": 40,
    "particles": {
      "number": {
        "value": 140,
        "density": {
          "enable": true,
          "area": 800
        }
      },
      "color": {
        "value": "#ffffff"
      },
      "shape": {
        "type": "circle",
        "stroke": {
          "width": 0,
          "color": "#000000"
        }
      },
      "opacity": {
        "value": 0.1,
        "random": false,
        "animation": {
          "enable": true,
          "speed": 1,
          "minimumValue": 0.1,
          "sync": true
        }
      },
      "size": {
        "value": 1,
        "random": false,
        "animation": {
          "enable": false,
          "speed": 40,
          "minimumValue": 0.1,
          "sync": false
        }
      },
      "lineLinked": {
        "enable": true,
        "distance": 150,
        "color": "#ffffff",
        "opacity": 0.1,
        "width": 1
      },
      "move": {
        "enable": true,
        "speed": 1.7,
        "direction": "none",
        "random": true,
        "straight": false,
        "outMode": "out",
        "bounce": false,
        "attract": {
          "enable": false,
          "rotate": {
            "x": 600,
            "y": 1200
          }
        }
      }
    },
    "detectRetina": true,
    "interactivity": {
      "detectsOn": "canvas",
      "events": {
        "onHover": {
          "enable": false
        },
        "onClick": {
          "enable": false
        },
        "resize": true
      }
    }
  }
);

console.log(
  '%cMade with %c❤%c by Cappig. \n\n%cYou can help improve the website \nand the bot by contributing code at: \nhttps://github.com/cappig/MC-status-bot',
  'font-weight: bold; font-size: 15px;','color: #e25555; font-size: 15px;', ' color: unset; font-weight: bold; font-size: 15px;', 'font-weight: normal'
);

/* Detect profile click */
// When the doc is loaded
$(function() {
  $(".profile").click(function () {
    $("#dropdown").toggleClass('active');
  });
});