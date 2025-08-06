"use client";

import { useSalas } from "@/hooks/useSalas";

interface SalaInfoProps {
  salaNome: string;
}

const SalaInfo = ({ salaNome }: SalaInfoProps) => {
  const { salas } = useSalas();

  const sala = salas.find((s) => s.name === salaNome);

  if (!sala || !salaNome) {
    return null;
  }

  return (
    <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg max-h-24 overflow-y-auto">
      <h4 className="font-medium text-blue-900 text-sm mb-1">{sala.name}</h4>
      <div className="text-xs text-blue-800 space-y-1">
        <p>
          <strong>Capacidade:</strong> {sala.capacity} pessoas
        </p>
        {sala.resources.length > 0 && (
          <div>
            <strong>Recursos:</strong>
            <div className="mt-1 text-xs">
              {sala.resources.map((resource, index) => (
                <span key={resource.id}>
                  {resource.name}
                  {index < sala.resources.length - 1 && ", "}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalaInfo;
