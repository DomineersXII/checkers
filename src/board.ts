import { drawInputtedPiece, coverLocationOnBoard, renderGameBoard, highlightLocationOnBoard } from "./canvas"
import { Piece } from "./PieceEnum"
import { upDirection, downDirection, upTakeDirections, downTakeDirections } from "./PieceMoveDirections"

const currentPlayer = document.getElementById("currentPlayer") as HTMLHeadingElement

class Board  {
    currentTurn = Piece.Red
    #gameState = [
        [0,2,0,2,0,2,0,2],
        [2,0,2,0,2,0,2,0],
        [0,2,0,2,0,2,0,2],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [1,0,1,0,1,0,1,0],
        [0,1,0,1,0,1,0,1],
        [1,0,1,0,1,0,1,0],
    ]

    #positionIsInBoardBounds(position: [number, number]) { //returns whether the given position is in our out of bounds
        const [x,y] = position

        if (y < 0) {
            return false
        }

        if (y > this.#gameState.length-1) {
            return false
        }

        if (x < 0) {
            return false
        }

        if (x > this.#gameState[y].length-1) {
            return false
        }

        return true
    }


    #isSquareEmpty(position: [number, number]): boolean {
        const [x, y] = position

        return this.#gameState[y][x] === 0
    }
    
    #getPieceAtSquare(position: [number, number]) {
        const [x, y] = position

        return this.#gameState[y][x]
    }
    
    #returnMovablePositionsUp(position: [number, number]): [number, number][] {
        const [x,y] = position
        const moveableUpPositions: [number, number][] = []

        for (let i = 0; i < upDirection.length; i++) {
            const currentMove = upDirection[i]

            const positionToCheck: [number, number] = [(x+currentMove[1]), (y+currentMove[0])]

            if (!this.#positionIsInBoardBounds(positionToCheck)) {continue}

            if (this.#isSquareEmpty(positionToCheck)) {
                moveableUpPositions.push(positionToCheck)
            }
        }

        return moveableUpPositions
    }

    #returnMovablePositionsDown(position: [number, number]): [number, number][] {
        const [x,y] = position
        const moveableDownPositions: [number, number][] = []

        for (let i = 0; i < downDirection.length; i++) {
            const currentMove = downDirection[i]

            const positionToCheck: [number, number] = [(x+currentMove[1]), (y+currentMove[0])]

            if (!this.#positionIsInBoardBounds(positionToCheck)) {continue}

            if (this.#isSquareEmpty(positionToCheck)) {
                moveableDownPositions.push(positionToCheck)
            }
        }

        return moveableDownPositions
    }

    #returnTakeablePositionsUp(position: [number, number]): [number, number][] {
        const [x, y] = position
        const takeableUpPositions: [number, number][] = []

        for (let i = 0; i < upTakeDirections.length; i++) {
            const currentMove = upTakeDirections[i]

            const positionToCheck: [number, number] = [(x+currentMove[1]), (y+currentMove[0])]

            if (!this.#positionIsInBoardBounds(positionToCheck)) {continue}
            
            if (this.#isSquareEmpty(positionToCheck)) {
                const midpoint = [(x + positionToCheck[0])/2, (y+positionToCheck[1])/2] as [number, number]
                const midpointValue = this.#getPieceAtSquare(midpoint) 
                const myPieceValue = this.#getPieceAtSquare(position) 

                if (midpointValue !== 0 && midpointValue !== myPieceValue && midpointValue !== myPieceValue + 2 && midpointValue !== myPieceValue - 2) {
                    takeableUpPositions.push(positionToCheck)
                }
            }
        }

        return takeableUpPositions
    }

    #returnTakeablePositionsDown(position: [number, number]): [number, number][] {
        const [x, y] = position
        const takeableDownPositions: [number, number][] = []

        for (let i = 0; i < downTakeDirections.length; i++) {
            const currentMove = downTakeDirections[i]

            const positionToCheck: [number, number] = [(x+currentMove[1]), (y+currentMove[0])]

            if (!this.#positionIsInBoardBounds(positionToCheck)) {continue}
            
            if (this.#isSquareEmpty(positionToCheck)) {
                const midpoint = [(x + positionToCheck[0])/2, (y+positionToCheck[1])/2] as [number, number]
                const midpointValue = this.#getPieceAtSquare(midpoint) 
                const myPieceValue = this.#getPieceAtSquare(position) 

                if (midpointValue !== 0 && midpointValue !== myPieceValue && midpointValue !== myPieceValue + 2 && midpointValue !== myPieceValue - 2) {
                    takeableDownPositions.push(positionToCheck)
                }
            }
        }

        return takeableDownPositions
    }

    #canTakeDown(position: [number, number]): boolean {
        return this.#returnTakeablePositionsDown(position).length > 0
    }

    #canTakeUp(position: [number, number]): boolean {
        return this.#returnTakeablePositionsUp(position).length > 0
    }

    #canMoveDown(position: [number, number]): boolean {
       return this.#returnMovablePositionsDown(position).length > 0
    }

    #canMoveUp(position: [number, number]): boolean {
        return this.#returnMovablePositionsUp(position).length > 0
    }

  

    changeTurn() {
        if (board.currentTurn === Piece.Red) {
            board.currentTurn = Piece.Black
            currentPlayer.textContent = "Black's turn"
        } else {
            board.currentTurn = Piece.Red
            currentPlayer.textContent = "Red's turn"
        }

        renderGameBoard()

        for (let i = 0; i < this.#gameState.length; i++) {
            for (let j = 0; j < this.#gameState[i].length; j++) {
                if (this.#gameState[i][j] > 0) {
                    drawInputtedPiece([j, i], this.#gameState[i][j])
                }
            }
        }

        this.#highlightAllPieces()
    }

    initialize() {
        renderGameBoard()
        this.#setTurn(Piece.Red) //red is always first

        for (let i = 0; i < this.#gameState.length; i++) {
            for (let j = 0; j < this.#gameState[i].length; j++) {
                if (this.#gameState[i][j] > 0) {
                    drawInputtedPiece([j, i], this.#gameState[i][j])
                }
            }
        }
    }


    pieceCanMove(position: [number, number]): boolean {
        const [x, y] = position
        const piece = this.#gameState[y][x]

        if (piece === 0) {return false}
        if (this.currentTurn !== piece && this.currentTurn+2 !== piece) {return false}

        let canMove = false

        if (piece == Piece.Black) { //black
            canMove = this.#canMoveDown(position)

            if (!canMove) {canMove = this.#canTakeDown(position)}
        } else if (piece == Piece.Red) { //red
           canMove = this.#canMoveUp(position)

           if (!canMove) {canMove = this.#canTakeUp(position)}
        } else { //king
            canMove = this.#canMoveUp(position)

            if (!canMove) {canMove = this.#canMoveDown(position)}
            if (!canMove) {canMove = this.#canTakeUp(position)}
            if (!canMove) {canMove = this.#canTakeDown(position)}
        }

        return canMove
    }



    possibleMovePositions(position: [number, number]): [number, number][] {
        const [x, y] = position
        const piece = this.#gameState[y][x]

        if (piece == Piece.Black) { //black
            const possiblePositions = this.#returnMovablePositionsDown(position)

            return possiblePositions
        } else if (piece == Piece.Red) { //red
            const possiblePositions = this.#returnMovablePositionsUp(position)

            return possiblePositions
        } else { //king
            const possibleUpPositions = this.#returnMovablePositionsUp(position)
            const possibleDownPositions = this.#returnMovablePositionsDown(position)

            return possibleDownPositions.concat(possibleUpPositions)
        }
    }

    possibleTakePositions(position: [number, number]): [number, number][] {
        const [x, y] = position
        const piece = this.#gameState[y][x]

        if (piece == Piece.Black) { //black
            const possiblePositions = this.#returnTakeablePositionsDown(position)

            return possiblePositions
        } else if (piece == Piece.Red) { //red
            const possiblePositions = this.#returnTakeablePositionsUp(position)

            return possiblePositions
        } else { //king
            const possibleUpPositions = this.#returnTakeablePositionsUp(position)
            const possibleDownPositions = this.#returnTakeablePositionsDown(position)

            return possibleDownPositions.concat(possibleUpPositions)
        }
    }

    #highlightAllPieces() {
        let piecesCanMove = false

        for (let i = 0; i < this.#gameState.length; i++) {
            for (let j = 0; j < this.#gameState[i].length; j++) {
                if (this.#gameState[i][j] === this.currentTurn || this.#gameState[i][j] === this.currentTurn+2) {
                    const canMove = this.pieceCanMove([j, i])

                    if (canMove === true) {
                        piecesCanMove = true
                        highlightLocationOnBoard([j, i])
                    }
                }
            }
        }

        if (piecesCanMove === false) {
            if (this.currentTurn === 1) {
                currentPlayer.textContent = "Black won"
            } else {
                currentPlayer.textContent = "Red won"
            }   
        }
    }

    #setTurn(turn: Piece.Black | Piece.Red) {
        //here we need to code so it highlights pieces that can move on the current team
        this.currentTurn = turn

        this.#highlightAllPieces()
    }

    updatePieceLocation(formerLocation: [number, number], newLocation: [number, number]) {
        coverLocationOnBoard(formerLocation)

        const [oldX, oldY] = formerLocation
        const [newX, newY] = newLocation
        const teamSave = this.#gameState[oldY][oldX]

        drawInputtedPiece(newLocation, teamSave)

        this.#gameState[oldY][oldX] = 0
        this.#gameState[newY][newX] = teamSave

        if (teamSave === Piece.Red) {
            if (newY === 0) {
                console.log("kinging")
                this.kingPiece(newLocation)
            }
        } else if (teamSave === Piece.Black) {
            if (newY === 7) {
                this.kingPiece(newLocation)
            }
        }
    }

    removePiece(pieceLocation : [number, number]) { //called when a piece gets taken
        coverLocationOnBoard(pieceLocation)

        const [x,y] = pieceLocation

        this.#gameState[y][x] = 0
    }
    
    kingPiece(pieceLocation: [number, number]) {
        const [x,y] = pieceLocation
        this.#gameState[y][x] += 2 //king is the normal value +2, so for red its 3 and for black its 4

        console.log(this.#gameState)
        drawInputtedPiece(pieceLocation, this.#gameState[y][x])
    }
}

export const board = new Board()