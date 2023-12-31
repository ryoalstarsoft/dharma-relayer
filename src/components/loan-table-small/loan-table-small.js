import React from 'react';
import './loan-table-small.css';
import { formatLoanscanLink, calculateTotalPaymentAmount } from '../../common/services/utilities';
import { SHOW_LOANSCAN_LINK } from '../../common/api/config';
import Paging from '../../components/paging/paging.js';
import Spinner from '../../components/spinner/spinner.js';


function redirectToLoanscan(issuanceHash) {
	window.open(formatLoanscanLink(issuanceHash), "_blank");
}


function handleRepayInternal(handleRepay, row, event) {
	handleRepay(row);
	event.stopPropagation();
}

function renderRows({ rows, handleRepay, repayAvailable, sellLoanAvailable }) {
	let i = 0;

	return rows
		.sort((a, b) => a.date < b.date ? 1 : (-1))
		.map(row => {

			const amount = row.principalAmount;
			const amountString = amount.toFormat(3);
			const interestRate = row.interestRate.toFixed(2);
			const totalRepayment = calculateTotalPaymentAmount(amount, row.interestRate);
			const repaymentString = totalRepayment.toFormat(3);
			const rowIsClickable = SHOW_LOANSCAN_LINK && row.issuanceHash;
			const rowClassName = rowIsClickable ? "loan-table-small__clickable-row" : "";

			return (
				<tr key={i++} className={rowClassName} onClick={() => { rowIsClickable && redirectToLoanscan(row.issuanceHash) }}>
					<td className="loan-table-small__table-cell">{row.date.toLocaleDateString()} <br /> {row.date.toLocaleTimeString()}</td>
					<td className="loan-table-small__table-cell loan-table-small__wide-cell"><strong>{amountString}</strong> {row.principalTokenSymbol} </td>
					<td className="loan-table-small__table-cell"><strong>{interestRate}</strong> %</td>
					<td className="loan-table-small__table-cell"><strong>{row.termLength.toNumber()}</strong> {row.amortizationUnit.slice(0, 1)}</td>
					<td className="loan-table-small__table-cell loan-table-small__wide-cell"><strong>{repaymentString}</strong> {row.principalTokenSymbol}</td>
					{
						sellLoanAvailable &&
						<td className="loan-table-small__table-cell loan-table-small__button-cell">
							<button disabled className="loan-table-small__btn loan-table-small__btn_disabled" title="Coming soon">Sell</button>
						</td>
					}
					{
						repayAvailable &&
						<td className="loan-table-small__table-cell loan-table-small__button-cell">
							<button onClick={(event) => handleRepayInternal(handleRepay, row, event)} className="loan-table-small__btn">Repay</button>
						</td>
					}
				</tr>
			);
		});
}

function renderPagination({ offset, totalItemsCount, pageSize, onPageClick }) {
	return (
		<div className="relayer-pagination">
			<Paging
				offset={offset}
				totalItemsCount={totalItemsCount}
				pageSize={pageSize}
				onPageClick={onPageClick}
				visiblePagesCount={5} />
		</div>
	);
}

function LoanTableSmall(props) {
	if (props.isLoading) {
		return (
			<div className="loan-table-small__spinner-container">
				<Spinner />
			</div>
		);
	}
	return (
		<React.Fragment>
			<div className={`loan-table-small scrollable-table ${props.containerClassName}`}>
				<div className="loan-table-small__header">
					{props.header}
				</div>
				<table className="loan-table-small__table">
					<thead>
						<tr>
							<th className="loan-table-small__table-header" title={props.dateColumnHeader}>Date</th>
							<th className="loan-table-small__table-header loan-table-small__wide-cell" title="Loan amount">Amount</th>
							<th className="loan-table-small__table-header" title="Interest rate per loan term">Interest</th>
							<th className="loan-table-small__table-header" title="Loan term">Term</th>
							<th className="loan-table-small__table-header loan-table-small__wide-cell" title="Total Repayment">Total Repayment</th>
							{
								props.sellLoanAvailable &&
								<th className="loan-table-small__table-header loan-table-small__button-cell" title=""> </th>
							}
							{
								props.repayAvailable &&
								<th className="loan-table-small__table-header loan-table-small__button-cell" title=""> </th>
							}
						</tr>
					</thead>
					<tbody className="loan-table-small__table-body scrollable-table__table-body scrollable">
						{renderRows(props)}
					</tbody>
				</table>
			</div>
			{props.showPaging && renderPagination(props)}
		</React.Fragment>
	);
}

export default LoanTableSmall;