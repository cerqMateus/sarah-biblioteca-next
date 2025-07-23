import React from "react";

interface SideBarProps {
  children?: React.ReactNode;
  title?: string;
  bottomButton?: React.ReactNode;
}

const SideBar = ({
  children,
  title = "Informações",
  bottomButton,
}: SideBarProps) => {
  return (
    <aside className="h-full w-full bg-[var(--sidebar)] text-[var(--sidebar-foreground)] border-r border-[var(--sidebar-border)] flex flex-col p-6 shadow-md rounded-tr-xl rounded-br-xl">
      <h2 className="text-xl font-bold mb-4 text-[var(--sidebar-primary)]">
        {title}
      </h2>
      <div className="flex-1 text-sm">
        {children ? (
          children
        ) : (
          <ul className="space-y-2">
            <li>• Utilize o menu para navegar.</li>
            <li>• As reservas são feitas na página de reservas.</li>
          </ul>
        )}
      </div>
      {bottomButton && (
        <div className="mt-6 pt-4 border-t border-[var(--sidebar-border)]">
          {bottomButton}
        </div>
      )}
    </aside>
  );
};

export default SideBar;
