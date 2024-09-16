import { Piece } from "./PieceEnum"


//html elements
const gameBoard = document.getElementById("gameBoard")! as HTMLCanvasElement
const ctx = gameBoard?.getContext("2d")! as CanvasRenderingContext2D
const crownSource = document.getElementById("crownSource") as CanvasImageSource

//constants
const cellCount = 8
const cellWidth = gameBoard.width / cellCount
const cellHeight = gameBoard.height / cellCount



export function renderGameBoard() {
    const gridColors = ["#ffcd82", "#8f5702"]

    for (let i = 0; i < cellCount; i++) {
        for (let j = 0; j < cellCount; j++) {
            ctx.fillStyle = gridColors[(i + j) % 2]
            ctx.fillRect(j * cellWidth, i * cellHeight, cellWidth, cellHeight)
        }
    }
}

function _getPieceColor(piece: Piece): string {
   return piece === Piece.Red || piece === Piece.RedKing ? "#ff0000" : "#000000" //returns red or black based on the piece's team.
}

function _drawCrown(x: number, y: number) { //this function isnt working for some reason
    ctx.drawImage(crownSource, x-19, y-20, cellWidth-50, cellHeight-50)
}

export function getBoardCoordinatesFromMousePosition(mouseX: number, mouseY: number): [number, number] {
    const cellX = Math.floor(mouseX/cellWidth)
    const cellY = Math.floor(mouseY/cellHeight)

    return [cellX, cellY]
}

export function drawInputtedPiece(pieceLocation: [number, number], pieceType: Piece) {
    const column = pieceLocation[0]
    const row = pieceLocation[1]

    const pieceX = (column*cellHeight) + (cellHeight/2)
    const pieceY = (row*cellWidth) + (cellWidth/2)


    ctx.fillStyle = _getPieceColor(pieceType)

    ctx.beginPath()
    ctx.arc(pieceX, pieceY, cellWidth/2 - 7, 0, 2 * Math.PI, false)
    ctx.closePath()
    ctx.fill()

    if (pieceType === Piece.RedKing || pieceType === Piece.BlackKing) {
        _drawCrown(pieceX, pieceY)
    }
}

export function coverLocationOnBoard(location: [number, number]) {
    const gridColors = ["#ffcd82", "#8f5702"]
    
    const x = location[0] * cellWidth
    const y = location[1] * cellHeight

    ctx.fillStyle = gridColors[(location[0] + location[1]) % 2]

    ctx.fillRect(x,y, cellWidth, cellHeight)
}

export function highlightLocationOnBoard(location: [number, number]) {
    const x = location[0] * cellWidth
    const y = location[1] * cellHeight

    ctx.strokeStyle = "#0000FF"
    ctx.lineWidth = 3

    ctx.strokeRect(x,y, cellWidth, cellHeight)
}

export function drawMoveCircleOnBoard(location: [number, number]) {
    const column = location[0]
    const row = location[1]
    
    const circleX = (column*cellHeight) + (cellHeight/2)
    const circleY = (row*cellWidth) + (cellWidth/2)

    ctx.fillStyle = "#0000ff80"
    
    ctx.beginPath()
    ctx.arc(circleX, circleY, cellWidth/6, 0, 2 * Math.PI, false)
    ctx.closePath()
    ctx.fill()
}

renderGameBoard() //for testing