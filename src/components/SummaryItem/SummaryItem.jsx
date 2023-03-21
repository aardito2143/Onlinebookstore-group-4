import ImgPlaceholder from "../ImgPlaceholder/ImgPlaceholder";

export default function SummaryItem(props) {
    const imageName = props.cart.title.replace(/[^A-Z0-9]/ig, "").toLowerCase();
    return (
        <div className="summary-item">
            <div style={{ "display" : "flex", alignContent: 'center', justifyContent: 'flex-start' }} >
                <ImgPlaceholder 
                    name='summary-thumbnail'
                    src={`/images/${imageName}.jpg`}
                    width='48px'
                    height='72px'
                    customId='summary-loading-ring'
                />
                {/* <img className="summary-thumbnail" src={`/images/${imageName}.jpg`} /> */}
                <p style={{ alignSelf: 'center' }}>{props.cart.title}</p>
            </div>
            <p>$ {props.cart.cost}</p>
            <p>{props.cart.quantity}</p>
            <p>$ {Number(props.cart.cost) * Number(props.cart.quantity)}</p>
        </div>
    )
}