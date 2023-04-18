const FancyBorder =({children})=>(
    <div className = 'FancyBOrders'style={{border: '5px', borderStyle:'outset', padding:'5px'}}>
        {children}
    </div>
)

export {FancyBorder}