import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props)
{
	return(
		<button className="square" onClick={props.onClick}>
			{props.value}
		</button>);
}

class Board extends React.Component
{

	renderSquare(i)
	{
		return <Square key={i} value={this.props.squares[i]} onClick={() => this.props.onClick(i)}/>;
	}

	renderRow(row)
	{
		var columns = [];
		for(var j = 0; j < 3; j++)
		{
			columns.push(this.renderSquare(3 * row + j));
		}
		return (
			<div key={row} className="board-row">
				{columns}
			</div>);
	}

	renderBoard()
	{
		var rows = [];
		for(var i = 0; i < 3; i++)
		{
			rows.push(this.renderRow(i));
		}
		return (
			<div>
				{rows}
			</div>);
	}

	render()
	{
		return this.renderBoard();
	}
}

class Game extends React.Component
{
	constructor(props)
	{
		super(props);
		this.state =
		{
			history:
			[{
				squares: Array(9).fill(null),
				column: null,
				row: null
			}],
			stepNumber: 0,
			xIsNext: true,
		};
	}

	handleClick(i)
	{
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		const current = history[history.length - 1];
		const squares = current.squares.slice();

		if (calculateWinner(squares) || squares[i])
		{
			return;
		}
		squares[i] = this.state.xIsNext ? 'X' : 'O';
		this.setState({history: history.concat([{squares: squares, column: i % 3, row: Math.trunc(i / 3)}]), stepNumber: history.length, xIsNext: !this.state.xIsNext,});
	}

	jumpTo(step)
	{
		this.setState({
			stepNumber: step,
			xIsNext: (step % 2) === 0,});
	}

	render()
	{
		const history = this.state.history;
		const number = this.state.stepNumber;
		const current = history[number];
		const winner = calculateWinner(current.squares);

		const moves = history.map((step, move) => {
			const desc = move ? 'Go to move #' + move + '(column: ' + step.column + ', row: ' + step.row + ')' : 'Go to game start';
			return (
				<li key={move}>
					<button className={number === move ? "selected-move" : ""} onClick={() => this.jumpTo(move)}>{desc}</button>
				</li>);});

		let status;
		if (winner)
		{
			status = 'Winner: ' + winner;
		}
		else if(history[history.length - 1].squares.indexOf(null) === -1)
		{
			status = 'Draw';
		}
		else
		{
			status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
		}

		return (
			<div className="game">
				<div className="game-board">
					<Board squares={current.squares} onClick={(i) => this.handleClick(i)} />
				</div>
				<div className="game-info">
					<div>{status}</div>
					<ol>{moves}</ol>
				</div>
			</div>);
	}
}

// ========================================

ReactDOM.render(
	<Game />,
	document.getElementById('root'));

function calculateWinner(squares)
{
	const lines =
	[
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	];
	for (let i = 0; i < lines.length; i++)
	{
		const [a, b, c] = lines[i];
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c])
		{
			return lines[i];
		}
	}
	return null;
}

function calculateWinningSquares(squares)
{
	const lines =
	[
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	];
	for (let i = 0; i < lines.length; i++)
	{
		const [a, b, c] = lines[i];
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c])
		{
			return lines[i];
		}
	}
	return null;
}
