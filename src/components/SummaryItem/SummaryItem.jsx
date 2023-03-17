export default function SummaryItem(props) {
    const imageName = props.replace(/[^A-Z0-9]/ig, "").toLowerCase();

    return (
        <div className="summary-item">
            <div style={{ "display" : "flex", alignContent: 'center', justifyContent: 'flex-start' }} >
                <img className="summary-thumbnail" src={`/images/${imageName}.jpg`} />
                <p style={{ alignSelf: 'center' }}>{props.title}</p>
            </div>
            <p>{props.price}</p>
            <p>{props.quantity}</p>
            <p>{props.price * props.quantity}</p>
        </div>
    )
}