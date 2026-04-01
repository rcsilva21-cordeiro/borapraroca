interface CategoryCardProps {
  icon: React.ReactNode;
  title: string;
  count: number;
}

const CategoryCard = ({ icon, title, count }: CategoryCardProps) => {
  return (
    <button className="group flex flex-col items-center gap-3 p-6 rounded-xl bg-card hover:bg-secondary border border-border/50 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="text-primary group-hover:text-forest-light transition-colors">
        {icon}
      </div>
      <span className="font-display font-semibold text-sm text-foreground">{title}</span>
      <span className="text-xs text-muted-foreground">{count} experiências</span>
    </button>
  );
};

export default CategoryCard;
