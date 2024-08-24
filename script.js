(() => {
    let baralho = document.querySelector("#baralho"),
        iniciar = document.querySelector("#iniciar"),
        barraNavegacao = document.querySelector("#barraNavegacao"),
        tempo = document.querySelector("#tempo"),
        textoMT = document.querySelector("#pMelhorTempo"),
        imgFundo = document.querySelector("#imgFundo"),
        cronometro, horas = 0, minutos = 0, segundos = 0,
        cartaVirada = false, telaBloqueada = false, pares = 0,
        cartas = {},
        imgsFrente = ["frente1.png", "frente2.png", "frente3.png", "frente4.png", "frente5.png", "frente6.png", "frente7.png", "frente8.png"],
        imgTras = "tras.png",
        temas = ["Tecnologias", "Cyberpunk", "Watch Dogs"],
        tema = "",
        botoesTema = {}

    carregarTema()
    inserirBotoesDeTema()
    duplicarCartas()
    criarCartas()
    mostrarMelhorTempo()
    addClickCartas(cartas, imgsFrente)

    iniciar.addEventListener("click", () => {
        if (telaBloqueada == false) {
            embaralhar()
            setTimeout(() => { zerarTempo(); iniciarTempo() }, 3000)
        }
    })

    function inserirBotoesDeTema() {
        let div = document.createElement("div")
        let strTema = document.createElement("b")
        strTema.innerHTML = "Tema: "
        div.appendChild(strTema)
        for (let i = 0; i < temas.length; i++) {
            botoesTema[i] = document.createElement("button")
            botoesTema[i].innerText = temas[i]
            botoesTema[i].addEventListener("click", () => {
                trocarTema(botoesTema[i].innerHTML)
                salvarTema()
                location.reload()
            })
            div.appendChild(botoesTema[i])

        }

        barraNavegacao.appendChild(div)

    }

    function trocarTema(t) {
        tema = "./img/" + t.toLowerCase().replace(" ", "") + "/"
        console.log(tema)
        selecionarImagemFundo()
        return tema
    }

    function salvarTema() {
        t = localStorage.setItem("tema", tema)
    }


    function carregarTema() {
        let temaLs = null
        temaArmazenado = false
        try {
            temaLs = localStorage.getItem("tema")
            for (let i = 0; i < temas.length; i++) {
                if (temaLs == "./img/" + temas[i].toLowerCase().replace(" ", "") + "/") {
                    trocarTema(temas[i])
                    temaArmazenado = true
                    console.log("O tema armazenado foi carregado com sucesso")
                }
            }
            if (!temaArmazenado) {
                trocarTema(temas[0])
            }
        } catch (error) {
            console.log("Erro ao buscar tema no armazenamento local")
            console.log("Tema escolhido será o padrão")
            trocarTema(temas[0])
        }

    }

    function selecionarImagemFundo() {
        imgFundo.src = tema + "fundo.png"
    }

    function duplicarCartas() {
        for (let i = 0; i < 8; i++) {
            imgsFrente.push(imgsFrente[i])
        }
    }

    function criarCartas() {
        for (let c = 0; c < 16; c++) {
            let carta = document.createElement("img")
            cartas[c] = carta
            baralho.appendChild(cartas[c])
            cartas[c].src = tema + imgsFrente[c]
        }
    }

    function embaralhar() {
        telaBloqueada = true; pares = 0; cartaVirada = false
        for (let c = 0; c < 16; c++) {
            let carta1 = Math.floor(Math.random() * 16), carta2 = Math.floor(Math.random() * 16),
                cartaGuardada = imgsFrente[carta1]
            imgsFrente[carta1] = imgsFrente[carta2]
            imgsFrente[carta2] = cartaGuardada
        }
        for (let c = 0; c < 16; c++) {
            slide(cartas[c]); virar(cartas[c], imgsFrente[c]); slide(cartas[c])
            cartas[c].style.opacity = "0.9"
            setTimeout(() => { virar(cartas[c], imgTras) }, 4000)
            setTimeout(() => { telaBloqueada = false }, 4500)
        }
    }

    function iniciarTempo() {
        const horaInicio = Date.now();
        cronometro = setInterval(() => { contarTempo(horaInicio) }, 1000)
    }

    function zerarTempo() {
        clearInterval(cronometro)
    }

    function contarTempo(horaInicio) {
        const horaAgora = Date.now(), diferenca = new Date(horaAgora - horaInicio)
        horas = diferenca.getUTCHours(), minutos = diferenca.getUTCMinutes(),
            segundos = diferenca.getUTCSeconds()
        iniciar.innerText = "Reiniciar"
        tempo.innerText = horas + ":" + minutos + ":" + segundos
    }

    function salvarMelhorTempo() {
        let melhorTempo = localStorage.getItem("melhorTempo")
        if (melhorTempo > tempo.textContent || melhorTempo == undefined) {
            localStorage.setItem("melhorTempo", tempo.textContent)
            textoMT.innerText = tempo.textContent
        }
    }

    function mostrarMelhorTempo() {
        let botaoMT = document.querySelector("#bMelhorTempo")
        botaoMT.addEventListener("click", () => {
            let melhorTempo = localStorage.getItem("melhorTempo")
            if (melhorTempo != undefined) {
                textoMT.innerText = melhorTempo
            } else {
                window.alert("Não há 'Melhor Tempo'"); textoMT.innerText = "XXX"
            }
            if (botaoMT.innerText == "Mostrar Melhor Tempo") {
                botaoMT.innerText = "Ocultar Melhor Tempo"; slide(textoMT)
            } else {
                botaoMT.innerText = "Mostrar Melhor Tempo"; slide(textoMT)
            }
        })
    }

    function addClickCartas(cartas, imgsFrente) {
        let carta1 = "", carta2 = ""
        for (let c = 0; c < 16; c++) {
            cartas[c].addEventListener("click", () => {
                if (telaBloqueada == false && nomeImagem(cartas[c]) == imgTras) {
                    telaBloqueada = true
                    virar(cartas[c], imgsFrente[c])
                    if (!cartaVirada) {
                        setTimeout(() => { carta1 = cartas[c]; cartaVirada = true; telaBloqueada = false }, 700)

                    } else {
                        setTimeout(() => {
                            carta2 = cartas[c]
                            if (carta1.src == carta2.src) {
                                carta1.style.opacity = "0.4"; carta2.style.opacity = "0.4"
                                carta1 = ""; carta2 = ""
                                pares += 1
                                if (pares == 8) {
                                    zerarTempo(); salvarMelhorTempo(), pares = 0
                                }
                                cartaVirada = false; telaBloqueada = false
                            } else {
                                setTimeout(() => {
                                    virar(carta2, imgTras); carta2 = ""
                                    virar(carta1, imgTras); carta1 = ""
                                    cartaVirada = false
                                }, 1500)
                                setTimeout(() => { telaBloqueada = false }, 2000)
                            }
                        }, 700)
                    }
                } else if (telaBloqueada == false && nomeImagem(cartas[c]) != imgTras) {
                    window.alert("Jogada não permitida!")
                }
            })
        }
    }

    function nomeImagem(img) {
        caminhoDivido = img.src.split("/")
        nome = caminhoDivido[caminhoDivido.length - 1]
        return nome
    }

    function virar(objetoCarta, imagem) {
        objetoCarta.style.transition = "transform .5s"
        objetoCarta.style.transform = "rotateY(90deg)"
        setTimeout(() => {
            objetoCarta.style.transform = "rotateY(0deg)"; objetoCarta.src = tema + imagem
        }, 500)
    }

    function slide(elemento) {
        $(document).ready(function () { $(elemento).slideToggle("slow") })
    }
})()