import PropTypes from 'prop-types';

// 筛选组件，接收categories、selectedCategory、onCategoryChange、sortOrder、onSortOrderChange
// categories是分类列表，selectedCategory是选中的分类，onCategoryChange是分类改变的回调函数，sortOrder是排序方式，onSortOrderChange是排序方式改变的回调函数
// 当变化时，调用onCategoryChange和onSortOrderChange，传递新的值，然后更新state
function Filters({ categories,selectedCategory,onCategoryChange,sortOrder,onSortOrderChange }) {

    return(
        <div className='filters'>
            <label>
                Category:
                <select value={selectedCategory} onChange={(event) => onCategoryChange(event.target.value)}>
                    {categories.map(
                        (category) => (
                            <option key={category} value={category}>{category}</option>
                        )
                    )}
                </select>
            </label>
            <label>
                Sort by price:
                <select value={sortOrder} onChange={(event) => onSortOrderChange(event.target.value)}>
                    <option value="default">default</option>
                    <option value="asc">Low to High</option>
                    <option value="desc">High to Low</option>
                </select>
            </label>
        </div>
    )

}

Filters.propTypes = {
    categories:PropTypes.arrayOf(PropTypes.string).isRequired,
    selectedCategory:PropTypes.string.isRequired,
    onCategoryChange:PropTypes.func.isRequired,
    sortOrder:PropTypes.oneOf(['default','asc','desc']).isRequired,
    onSortOrderChange:PropTypes.func.isRequired
}

export default Filters;
