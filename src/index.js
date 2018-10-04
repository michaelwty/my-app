import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button className={['square', props.winnerLine ? 'winner-line': ''].join(' ')} onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        let boardRow = [];
        for(let i = 0; i < 3; i++)
        {
            let suqareCol = [];
            for(let j = 0; j < 3; j++)
            {
                let index = i * 3 + j;
                let bWinnerLine = this.props.winnerLine.indexOf(index) !== -1 ? true : false;
                suqareCol.push(<Square 
                                key={index}
                                value={this.props.squares[index]} 
                                onClick={() => this.props.onClick(index)} 
                                winnerLine={bWinnerLine}
                            />);
            }
            boardRow.push(<div key={i} className={'board-row'}> { suqareCol }</div>);
        }

        return (
            <div>
                { boardRow }
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [
                {
                    squares: Array(9).fill(null),
                    move: ''
                }
            ],
            stepNumber: 0,
            xIsNext: true
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? "X" : "O";
        this.setState({
            history: history.concat([
                {
                    squares: squares,
                    move: '(' + i % 3 + ',' +  Math.floor( i / 3 ) + ')'
                }
            ]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0
        });
    }

    sort(bAscending) {
        if(this.state.history.length <= 1) return


    }

    reset() {
        
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const location = history[move].move;
            const desc = move ?
                'Go to move #' + move + ':' + location :
                'Go to game start';
            return (
                <li key={move} className={move === this.state.stepNumber ? 'selected': ''}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        let status, winnerLine= [];
        if (winner) {
            status = "Winner: " + winner[0];
            winnerLine = winner[1];
        } else {
            if(this.state.stepNumber === this.state.history[0].squares.length)
                status = "Draw";
            else
                status = "Next player: " + (this.state.xIsNext ? "X" : "O");
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={i => this.handleClick(i)}
                        winnerLine={winnerLine}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
                <div className="game-action">
                    <button onClick={() => this.reset()}>reset</button>
                    <button onClick={() => this.sort()}>sort</button>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return [squares[a], lines[i]];
        }
    }
    return null;
}
