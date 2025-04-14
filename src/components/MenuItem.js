export default function MenuItem({ name, price, align }) {
  return (
    <div className={`menu-item-${align}`}>
      {align === 'left' ? (
        <>
          <span className="menu-price">${price}</span>
          <div className="line"></div>
          <span className="menu-name">{name}</span>
        </>
      ) : (
        <>
          <span className="menu-name">{name}</span>
          <div className="line"></div>
          <span className="menu-price">${price}</span>
        </>
      )}
    </div>
  );
}