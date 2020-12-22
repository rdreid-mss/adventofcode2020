// @ts-check
import { doPart, PuzzlePart } from "../aocFW.js";
window.onload = function () { doPart(new PuzzleSolution()); };
class PuzzleSolution extends PuzzlePart {
    // called after a file is selected, prior to processing
    init(inputElement, outputElement, answerElement) {
        super.init(inputElement, outputElement, answerElement);
        this.humanHand = new Array();
        this.crabHand = new Array();
    }
    // called once per record (line) in the input file
    processRecord(record) {
        if (record.length > 0) {
            if (record == "Player 1:")
                this.activeHand = this.humanHand;
            else if (record == "Player 2:")
                this.activeHand = this.crabHand;
            else
                this.activeHand.push(Number(record));
        }
        return true;
    }
    computeHash(hand) {
        let hash = 0;
        hand.forEach(card => hash += Math.pow(2, card));
        return hash;
    }
    playCombat(humanHand, crabHand) {
        let priorRounds = new Map();
        do {
            let humanHash = this.computeHash(humanHand);
            let crabHash = this.computeHash(crabHand);
            let crabHashes = priorRounds.has(humanHash) ? priorRounds.get(humanHash) : new Array();
            if (crabHashes.includes(crabHash))
                return true;
            crabHashes.push(crabHash);
            priorRounds.set(humanHash, crabHashes);
            let humanCard = humanHand.shift();
            let crabCard = crabHand.shift();
            if (humanCard <= humanHand.length && crabCard <= crabHand.length) {
                if (this.playCombat(humanHand.slice(0, humanCard), crabHand.slice(0, crabCard))) {
                    humanHand.push(humanCard);
                    humanHand.push(crabCard);
                }
                else {
                    crabHand.push(crabCard);
                    crabHand.push(humanCard);
                }
            }
            else if (humanCard > crabCard) {
                humanHand.push(humanCard);
                humanHand.push(crabCard);
            }
            else {
                crabHand.push(crabCard);
                crabHand.push(humanCard);
            }
        } while (humanHand.length >= 1 && crabHand.length >= 1);
        return humanHand.length > 0;
    }
    // called after all records are read in
    displayAnswer() {
        this.playCombat(this.humanHand, this.crabHand);
        let score = 0;
        let cardMultiplier = this.humanHand.length + this.crabHand.length;
        this.humanHand.forEach(card => score += card * cardMultiplier--);
        this.crabHand.forEach(card => score += card * cardMultiplier--);
        this.answerDisplay.innerText = "Winning score: " + score;
    }
}
