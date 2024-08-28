function locomotive() {
    gsap.registerPlugin(ScrollTrigger);

    // Using Locomotive Scroll from Locomotive https://github.com/locomotivemtl/locomotive-scroll

    const locoScroll = new LocomotiveScroll({
        el: document.querySelector("#main"),
        smooth: true
    });
    // each time Locomotive Scroll updates, tell ScrollTrigger to update too (sync positioning)
    locoScroll.on("scroll", ScrollTrigger.update);

    // tell ScrollTrigger to use these proxy methods for the "#main" element since Locomotive Scroll is hijacking things
    ScrollTrigger.scrollerProxy("#main", {
        scrollTop(value) {
            return arguments.length ? locoScroll.scrollTo(value, 0, 0) : locoScroll.scroll.instance.scroll.y;
        }, // we don't have to define a scrollLeft because we're only scrolling vertically.
        getBoundingClientRect() {
            return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
        },
        // LocomotiveScroll handles things completely differently on mobile devices - it doesn't even transform the container at all! So to get the correct behavior and avoid jitters, we should pin things with position: fixed on mobile. We sense it by checking to see if there's a transform applied to the container (the LocomotiveScroll-controlled element).
        pinType: document.querySelector("#main").style.transform ? "transform" : "fixed"
    });

    // each time the window updates, we should refresh ScrollTrigger and then update LocomotiveScroll. 
    ScrollTrigger.addEventListener("refresh", () => locoScroll.update());

    // after everything is set up, refresh() ScrollTrigger and update LocomotiveScroll because padding may have been added for pinning, etc.
    ScrollTrigger.refresh();

}

function loadingAnimation() {
    // let incr = document.querySelector(".line .number .incr")

    let t1 = gsap.timeline();
    // t1.from(".line h1", {
    //     y: 250,
    //     duration: 0.5,
    //     // delay:0.25,
    //     stagger: 0.25,
    //     onStart: () => {
    //         let adder = 0;
    //         let loop = setInterval(() => {
    //             if (adder < 100) {
    //                 adder += 1;
    //                 incr.textContent = `${adder}`;
    //             }
    //             else {
    //                 clearInterval(loop);
    //             }
    //             console.log("hi");
    //         }, 30);
    //     }
    // })

    // t1.to("#loader", {
    //     opacity: 0,
    //     duration: 0.75,
    //     delay: 2.25
    // })

    t1.from("#page1", {
        // delay:1,
        y: "100vh",
        duration: 1.25,
        ease: "power4.in",
    })
    t1.from("#page1 header", {
        opacity: 0,
        duration: 0.35,
        ease: "ease.in",
    })
    t1.from(".page1_center h1", {
        y: "7.25vw",
        delay: -0.5,
        duration: 1,
        ease: "ease.in",
        // ease: "power1.in",
        stagger: 0.1,
    })

    // t1.to("#loader", {
    //     display: "none"
    // })

    //GSAP's gsap.utils.toArray method, which allows you to iterate over all elements with the specified class name 
    //and apply the ScrollTrigger to each one separately.

    gsap.utils.toArray('.headline').forEach((element, index) => {
        gsap.from(element, {
            opacity: 0,
            y: "8vw",
            scrollTrigger: {
                trigger: element,
                // trigger: ".headline h1",
                scroller: "#main",
                // markers: true,
                start: "top 90%",
                end: "top 75%",
                // pin:true,
                scrub: 2, // Synchronizes the animation with the scrollbar
                once: true, // Ensures the animation only triggers once
                // Optionally, you can assign a unique ID for each ScrollTrigger if needed
                id: `trigger-${index}`
            }
        });
    });

    // Select all elements with the class 'scroll-element'
    gsap.utils.toArray('.underline').forEach((element, index) => {
        const rect = element.getBoundingClientRect();
        const line_width = rect.right - rect.left;
        gsap.from(element, {
            x: line_width,
            opacity: 0,
            duration: 1.5,
            // stagger:0.01,
            scrollTrigger: {
                trigger: element,
                scroller: "#main",
                start: "top 90%",
                end: "top 85%",
                scrub: 2, // Synchronizes the animation with the scrollbar
                once: true, // Ensures the animation only triggers once
                // Optionally, you can assign a unique ID for each ScrollTrigger if needed
                id: `trigger-${index}`
            }
        });
    });

}

function cursorAnimation() {
    let crsr = document.querySelector("#crsr");
    let ul = document.querySelectorAll("header li");
    let videoContainer = document.querySelector(".video_container");
    let video = document.querySelector('video');
    let videoCursor = document.querySelector('.video_cursor');
    let thumbnail = document.querySelector('#page2 img');
    let iconPlay = document.querySelector(".ri-play-large-fill");
    let iconPause = document.querySelector(".ri-pause-large-fill");
    let flagSpace = document.querySelector(".flagSpace_0");

    const lerp = (x, y, a) => x * (1 - a) + y * a;

    // document.addEventListener('mousemove', (event) => {
    //     // console.log(event.x,event.y)

    //     gsap.to(crsr, {
    //         x: event.clientX,
    //         y: event.clientY,
    //         // duration: 0.25,
    //         // ease:"Expo"
    //     })
    // })

    document.addEventListener('mousemove', (e) => {
        crsr.style.left = e.clientX + 'px';
        crsr.style.top = e.clientY + 'px';
    })

    ul.forEach(li => {
        li.addEventListener("mousemove", (event) => {
            let dim = li.getBoundingClientRect(); //gives dimension of the element box

            let xstart = dim.x;
            let xend = dim.x + dim.width;
            let movex = gsap.utils.mapRange(xstart, xend, 0, 1, event.clientX)

            let ystart = dim.y;
            let yend = dim.y + dim.height;
            let movey = gsap.utils.mapRange(ystart, yend, 0, 1, event.clientY)


            gsap.to(crsr, {
                scale: 2
            })
            gsap.to(li, {
                x: lerp(-25, 25, movex),
                y: lerp(-35, 35, movey),
                duration: 0.25
            })
        })
        li.addEventListener("mouseleave", (event) => {
            gsap.to(crsr, {
                scale: 1
            })
            gsap.to(li, {
                x: 0,
                y: 0,
                duration: 0.25
            })

        })

    });

    videoContainer.addEventListener("mouseenter", () => {
        crsr.style.display = "none";
        videoContainer.addEventListener("mousemove", (event) => {
            const rect = videoContainer.getBoundingClientRect();
            const vw = window.innerWidth;
            const vh = window.innerHeight;
            const xoffset = (60 * vw) / 100
            const yoffset = (7.5 * vh) / 100
            const x = event.clientX - rect.left - xoffset;
            const y = event.clientY - rect.top - yoffset;
            gsap.to(".video_cursor", {
                // position:"relative",
                x: x,
                y: y,
            })
        })
        videoContainer.addEventListener("mouseleave", () => {
            crsr.style.display = "block";
            gsap.to(".video_cursor", {
                x: 0,
                y: 0,
            })
        })
        // Click event on video to pause it
        video.addEventListener('click', () => {
            if (video.paused) {
                video.play();
                thumbnail.style.display = "none";
                iconPlay.style.display = "none";
                iconPause.style.display = "block"
                video.style.opacity = 1;
                // videoCursor.style.scale="0.5";
                gsap.to(videoCursor, {
                    scale: "0.5"
                })


            } else {
                video.pause();
                thumbnail.style.display = "block";
                video.style.opacity = 0;
                iconPlay.style.display = "block";
                iconPause.style.display = "none";
                // videoCursor.style.scale="1";
                gsap.to(videoCursor, {
                    scale: "1"
                })

            }
        });
    })

    document.addEventListener("mousemove", (event) => {
        gsap.to(".flag", {
            // opacity: 1,
            x: event.clientX - 150,
            y: event.clientY
        })
        flagSpace.addEventListener("mouseenter", (event) => {
            gsap.to(".flag", {
                opacity: 1,
                // duration:1,
                ease: "ease.in",
                // x: 0,
                // y: 0
            })
        })
        flagSpace.addEventListener("mouseleave", (event) => {
            gsap.to(".flag", {
                opacity: 0,
                // duration:2,
                ease: "ease.out",
                // x: 0,
                // y: 0
            })
        })
    })





}

function sheryAnimation() {
    Shery.imageEffect(".img_div", {
        style: 5,
        // debug:true,
        config: { "a": { "value": 3.89, "range": [0, 30] }, "b": { "value": 0.7, "range": [-1, 1] }, "zindex": { "value": -9996999, "range": [-9999999, 9999999] }, "aspect": { "value": 0.8333333333333334 }, "ignoreShapeAspect": { "value": true }, "shapePosition": { "value": { "x": 0, "y": 0 } }, "shapeScale": { "value": { "x": 0.5, "y": 0.5 } }, "shapeEdgeSoftness": { "value": 0, "range": [0, 0.5] }, "shapeRadius": { "value": 0, "range": [0, 2] }, "currentScroll": { "value": 0 }, "scrollLerp": { "value": 0.07 }, "gooey": { "value": true }, "infiniteGooey": { "value": false }, "growSize": { "value": 15, "range": [1, 15] }, "durationOut": { "value": 1.15, "range": [0.1, 5] }, "durationIn": { "value": 1.37, "range": [0.1, 5] }, "displaceAmount": { "value": 0.5 }, "masker": { "value": true }, "maskVal": { "value": 1.27, "range": [1, 5] }, "scrollType": { "value": 0 }, "geoVertex": { "range": [1, 64], "value": 1 }, "noEffectGooey": { "value": true }, "onMouse": { "value": 1 }, "noise_speed": { "value": 0.23, "range": [0, 10] }, "metaball": { "value": 0.73, "range": [0, 2], "_gsap": { "id": 40 } }, "discard_threshold": { "value": 0.63, "range": [0, 1] }, "antialias_threshold": { "value": 0.02, "range": [0, 0.1] }, "noise_height": { "value": 0.37, "range": [0, 2] }, "noise_scale": { "value": 14.5, "range": [0, 100] } },
        gooey: true,
    })
}

function footer_headline() {
    const headline = document.querySelector("footer .headline");
    const h1 = document.querySelector(".font");
    headline.addEventListener("mouseenter", () => {
        h1.classList.add("silk");
        h1.style.fontFamily = "silkserif-light";
        h1.style.fontWeight = 300;
        gsap.from(h1, {
            opacity: 0,
            duration: 0.5,
            stagger: 0.2,
        })
    })
    headline.addEventListener("mouseleave", () => {
        h1.classList.remove("silk");
        h1.style = "initial",
            gsap.to(h1, {
                opacity: 1,
                duration: 0.5,
                stagger: 0.2,
            })

    })

}

function footerAnimation(){
    let tiles=document.querySelectorAll(".tile");
    let li=document.querySelector("footer .links li");
    let liStyle = window.getComputedStyle(li);

    tiles.forEach(tile => {
        tile.addEventListener("mousemove",()=>{
            liStyle = window.getComputedStyle(li);
            let fontSizeValue = parseFloat(liStyle.fontSize);
            gsap.to(tile,{
                y:-1.1*fontSizeValue,
                duration:0.4,
                ease:"ease"
            })
        })
        tile.addEventListener("mouseleave",()=>{
            gsap.to(tile,{
                y:0,
                duration:0.4,
                ease:"ease"
            })
        })
    
    });
}

footerAnimation();
locomotive();
cursorAnimation();
loadingAnimation();
sheryAnimation();
footer_headline();