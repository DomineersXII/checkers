import { getBoardCoordinatesFromMousePosition, drawMoveCircleOnBoard, coverLocationOnBoard } from "./canvas"
import { board } from "./board"

const gameBoard = document.getElementById("gameBoard")! as HTMLCanvasElement

function isValidCell(x: number, y: number): boolean {
    if (x < 0) {
        return false
    }

    if (y < 0) {
        return false
    }

    if (x > 7) {
        return false
    }

    if (y > 7) {
        return false
    }

    return true
}

export function listenForMouseClicks() {
    let currentlySelectedPiece: [number, number] | null = null
    let storedMoveablePositions:[number, number][] = []
    let storedChainedTurnPiece: [number, number] | null = null
    let storedIsTaking = false

    document.addEventListener("mousedown", (ev: MouseEvent) => {
        const rect = gameBoard.getBoundingClientRect()
        const x = ev.clientX - rect.left
        const y = ev.clientY - rect.top
        
        const clickedCell = getBoardCoordinatesFromMousePosition(x,y)
        
        if(!isValidCell(clickedCell[0], clickedCell[1])) {return}

        for (let i = 0; i < storedMoveablePositions.length; i++) {
            if (storedMoveablePositions[i][0] === clickedCell[0] && storedMoveablePositions[i][1] === clickedCell[1]) {
                board.updatePieceLocation(currentlySelectedPiece!, clickedCell)
                if (storedIsTaking === true) {
                    const midpoint = [(currentlySelectedPiece![0]+ clickedCell[0])/2, (currentlySelectedPiece![1] + clickedCell[1])/2] as [number, number]

                    board.removePiece(midpoint)

                    if (board.pieceCanTake(clickedCell) === true) {
                        storedChainedTurnPiece = [clickedCell[0], clickedCell[1]]
                        board.chainTurn(clickedCell)
                    } else {
                        storedChainedTurnPiece = null
                    }
                }

                currentlySelectedPiece = null
                storedIsTaking = false
                storedMoveablePositions = []

                if (storedChainedTurnPiece === null) {
                    board.changeTurn()
                }

                return
            }
        }

        const canMove = board.pieceCanMove(clickedCell)
        const canTake = board.pieceCanTake(clickedCell)

        if (canMove !== true && canTake !== true) {return}
        if (board.canOtherPieceTake(clickedCell) === true && canTake === false) {return}
        if (storedChainedTurnPiece !== null ) {
            if (clickedCell[0] !== storedChainedTurnPiece[0] || clickedCell[1] !== storedChainedTurnPiece[1]) {
                return
            }
        }


        let moveablePositions = board.possibleTakePositions(clickedCell)
        storedIsTaking = true


        if (moveablePositions.length === 0) {
            storedIsTaking = false
            moveablePositions = board.possibleMovePositions(clickedCell)
        }

        storedMoveablePositions = moveablePositions

        if (currentlySelectedPiece !== null) {
            const oldSelectedPieceMoveablePositions = board.possibleMovePositions(currentlySelectedPiece)
            const oldSelectedTakePositions = board.possibleTakePositions(currentlySelectedPiece)

            const combined = oldSelectedPieceMoveablePositions.concat(oldSelectedTakePositions)

            for (let i = 0; i < combined.length; i++) {
                coverLocationOnBoard(combined[i])
            }
        }

        if (currentlySelectedPiece !== null && currentlySelectedPiece[0] == clickedCell[0] && currentlySelectedPiece[1] == clickedCell[1]) {
            currentlySelectedPiece = null
            storedMoveablePositions = []
            storedIsTaking = false

            console.log(storedChainedTurnPiece)
            return
        }

        for (let i = 0; i < moveablePositions.length; i++) {
            drawMoveCircleOnBoard(moveablePositions[i])
        }

        currentlySelectedPiece = clickedCell
    })
}