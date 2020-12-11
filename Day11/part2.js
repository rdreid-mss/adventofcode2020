// @ts-check
import { doPart, PuzzlePart } from "../aocFW.js";
window.onload = function () { doPart(new PuzzleSolution()); };
class PuzzleSolution extends PuzzlePart {
    // called after a file is selected, prior to processing
    init(inputElement, outputElement, answerElement) {
        super.init(inputElement, outputElement, answerElement);
        this.waitingArea = new Array();
    }
    // called once per record (line) in the input file
    processRecord(record) {
        if (record.length > 0) {
            let seats = new Array();
            for (let nLoop = 0; nLoop < record.length; nLoop++)
                seats.push(record.substr(nLoop, 1));
            this.waitingArea.push(seats);
        }
        return true;
    }
    // called after all records are read in
    displayAnswer() {
        let priorSeats;
        let occupiedSeats = 0;
        let seatChange;
        do {
            priorSeats = occupiedSeats;
            occupiedSeats = 0;
            seatChange = false;
            let nextConfiguration = new Array();
            for (let loop1 = 0; loop1 < this.waitingArea.length; loop1++) {
                let nextRow = new Array();
                for (let loop2 = 0; loop2 < this.waitingArea[loop1].length; loop2++) {
                    let currentState = this.waitingArea[loop1][loop2];
                    let newState = this.calcSeatState(loop1, loop2);
                    if (newState == "#")
                        occupiedSeats++;
                    nextRow.push(newState);
                    if (currentState != newState)
                        seatChange = true;
                }
                nextConfiguration.push(nextRow);
            }
            this.waitingArea = nextConfiguration;
        } while (seatChange);
        this.answerDisplay.innerText = String(occupiedSeats) + " seats are occupied when the state stabilizes";
    }
    calcSeatState(row, column) {
        let occupiedSeats = this.getSeatOccupied(row, column, -1, -1);
        occupiedSeats += this.getSeatOccupied(row, column, -1, 0);
        occupiedSeats += this.getSeatOccupied(row, column, -1, 1);
        occupiedSeats += this.getSeatOccupied(row, column, 0, -1);
        occupiedSeats += this.getSeatOccupied(row, column, 0, 1);
        occupiedSeats += this.getSeatOccupied(row, column, 1, -1);
        occupiedSeats += this.getSeatOccupied(row, column, 1, 0);
        occupiedSeats += this.getSeatOccupied(row, column, 1, 1);
        let currentState = this.waitingArea[row][column];
        if (currentState == "L" && occupiedSeats == 0)
            return "#";
        if (currentState == "#" && occupiedSeats >= 5)
            return "L";
        return currentState;
    }
    getSeatOccupied(row, column, rowDirection, columnDirection) {
        let newRow = row + rowDirection;
        let newColumn = column + columnDirection;
        if (newRow < 0 || newColumn < 0)
            return 0;
        if (newRow >= this.waitingArea.length)
            return 0;
        if (newColumn >= this.waitingArea[newRow].length)
            return 0;
        if (this.waitingArea[newRow][newColumn] == "#")
            return 1;
        if (this.waitingArea[newRow][newColumn] == "L")
            return 0;
        return this.getSeatOccupied(newRow, newColumn, rowDirection, columnDirection);
    }
}
