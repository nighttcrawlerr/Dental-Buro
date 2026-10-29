"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

/**
 * Карта Яндекса — только по нажатию. Виджет ставит cookie Яндекса, а
 * политика обещает, что без согласия сервисы Яндекса не загружаются;
 * нажатие на кнопку и есть согласие на эту карту.
 */
export function YandexMap({ address, geo }: { address: string; geo: { lat: number; lon: number } }) {
  // Метка по координатам, а не поиск по адресу: у поиска Яндекс показывает рекламу внизу карты.
  const point = `${geo.lon},${geo.lat}`;
  const [shown, setShown] = useState(false);

  return (
    <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-media border border-stone bg-linen">
      {shown ? (
        <iframe
          title={`Карта: ${address}`}
          src={`https://yandex.ru/map-widget/v1/?ll=${point}&pt=${point},pm2rdm&z=17`}
          className="size-full"
          allowFullScreen
        />
      ) : (
        <div className="flex flex-col items-center gap-4 px-6 text-center">
          <p className="text-ink">{address}</p>
          <Button variant="ghost" onClick={() => setShown(true)}>
            Показать карту
          </Button>
          <p className="text-caption tracking-normal text-graphite">Карта загрузится с сервиса Яндекс Карты</p>
        </div>
      )}
    </div>
  );
}
