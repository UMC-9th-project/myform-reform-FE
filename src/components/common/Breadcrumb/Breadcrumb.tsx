import { Link } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

const Breadcrumb = ({ items, className = '' }: BreadcrumbProps) => {
  return (
    <nav className={`flex items-center gap-2 body-b2-rg text-[var(--color-gray-50)] ${className}`}>
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {index > 0 && <span>›</span>}
          {item.path ? (
            <Link 
              to={item.path} 
              className="hover:text-[var(--color-black)] transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-[var(--color-black)]">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
};

export default Breadcrumb;
