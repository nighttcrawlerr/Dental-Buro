"use client";

/**
 * Кнопка удаления с подтверждением. Удаление необратимо, а стоит кнопка
 * рядом со сменой статуса — промахнуться легко.
 */
export function DeleteButton() {
  return (
    <button
      type="submit"
      onClick={(e) => {
        if (!confirm("Удалить заявку насовсем? Восстановить её будет нельзя.")) e.preventDefault();
      }}
      className="label-mono min-h-11 cursor-pointer rounded-button border border-alert/50 px-4 text-alert hover:bg-alert hover:text-cream"
    >
      Удалить заявку
    </button>
  );
}
