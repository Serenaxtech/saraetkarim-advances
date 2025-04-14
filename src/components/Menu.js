import Image from 'next/image';
import MenuItem from './MenuItem';

export default function Menu() {
  const leftItems = [
    { name: 'Chocolate', price: '40.00' },
    { name: 'Double Es', price: '25.00' },
    { name: 'Caramel', price: '45.00' },
    { name: 'Doppio', price: '50.00' }
  ];

  const rightItems = [
    { name: 'Espresso', price: '30.00' },
    { name: 'Cappuccino', price: '30.00' },
    { name: 'Mocha', price: '25.00' },
    { name: 'Latte', price: '25.00' }
  ];

  return (
    <section className="popular-menu">
      <div className="menu-container">
        <h2 className="menu-title">Popular Menu</h2>
        <div className="menu-layout">
          <div className="menu-column-left">
            {leftItems.map((item, index) => (
              <MenuItem key={index} {...item} align="left" />
            ))}
          </div>
          
          <div className="menu-center">
            <Image
              src="/images/silhouettes.png"
              alt="Coffee Couple"
              width={300}
              height={400}
              className="silhouettes-image"
              priority
            />
          </div>

          <div className="menu-column-right">
            {rightItems.map((item, index) => (
              <MenuItem key={index} {...item} align="right" />
            ))}
          </div>
        </div>
        <div className="menu-footer">
          <a href="#" className="btn">Our Menu</a>
        </div>
      </div>
    </section>
  );
}