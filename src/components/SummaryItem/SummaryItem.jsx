

export default function SummaryItem() {
    return (
        <div className="summary-item">
            <div style={{ "display" : "flex", alignContent: 'center', justifyContent: 'flex-start' }} >
                <img className="summary-thumbnail" src="/images/book_placeholder.png" />
                <p style={{ alignSelf: 'center' }}>The Lord of the Rings</p>
            </div>
            <p>$4.99</p>
            <p>1</p>
            <p>$4.99</p>
        </div>
    )
}