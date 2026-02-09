import PropTypes from 'prop-types';

function ProductCard({title,price,image,rating,description}) {
    const ratingValue = rating.rate ?? 0;
    const ratingCount = rating.count ?? 0;
    const formattedDescription = 
        description.length > 100 ? description.slice(0,100) + '...' : description;
    return(
        <div className='product-card'>
            <div className="image-wrapper">
                <img src={image} alt={title} />
            </div>
            
            <h2>{title}</h2>

            <p className="price">{price.toFixed(2)}</p>
            <p className="rating">
                <span className="star">★ {ratingValue}</span>
                <span className="count">({ratingCount})</span>
            </p>
            <p className="description">{formattedDescription}</p>
            
        </div>
    )
}

ProductCard.propTypes = {
    title:PropTypes.string.isRequired,
    price:PropTypes.number.isRequired,
    image:PropTypes.string.isRequired,
    rating:PropTypes.shape({
        rate:PropTypes.number.isRequired,
        count:PropTypes.number.isRequired
    }).isRequired,
    description:PropTypes.string.isRequired
}

export default ProductCard;