import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { cx } from 'class-variance-authority';
import { pager } from './utils';

interface PaginationProps {
  setPage: (n: ((n: number) => number) | number) => void;
  page: number;
  perPage: number;
  totalData: number;
  className?: string;
}

const PageButton = ({
  page,
  currentPage,
  setPage,
}: Pick<PaginationProps, 'setPage' | 'page'> & {
  currentPage: number;
}) => (
  <button
    className={cx(
      'block h-8 w-8 rounded border text-center leading-8',
      page === currentPage
        ? 'border-blue-600 bg-blue-600 text-white'
        : 'border-gray-100',
      'hover:border-blue-600'
    )}
    type="button"
    onClick={() => setPage(currentPage)}
  >
    {currentPage}
  </button>
);

export const Pagination = ({
  setPage,
  page,
  perPage,
  totalData = 0,
  className,
}: PaginationProps) => {
  const pages = Math.ceil(totalData / perPage);
  const prevDisabled = page === 1;
  const nextDisabled = page === pages;

  function next() {
    if (page < pages) {
      setPage((current) => current + 1);
    }
  }

  function previous() {
    if (page > 1) {
      setPage((current) => current - 1);
    }
  }

  return (
    <ol
      className={cx('flex justify-center gap-1 text-xs font-medium', className)}
    >
      <li>
        <button
          onClick={previous}
          className={cx(
            'inline-flex h-8 w-8 items-center justify-center rounded border border-gray-100',
            prevDisabled
              ? 'cursor-not-allowed bg-neutral-100'
              : 'hover:border-blue-600'
          )}
        >
          <span className="sr-only">Prev Page</span>
          <FiChevronLeft />
        </button>
      </li>

      {pager(page, pages).map((currentPage, index) => {
        if (currentPage) {
          return (
            <li key={index + 'xx'}>
              <PageButton
                page={page}
                setPage={setPage}
                currentPage={currentPage}
              />
            </li>
          );
        } else {
          return (
            <li key={index + Date.now()}>
              <div className="h-8 w-8 cursor-not-allowed rounded border px-2 pt-3 font-bold">
                ...
              </div>
            </li>
          );
        }
      })}

      <li>
        <button
          onClick={next}
          className={cx(
            'inline-flex h-8 w-8 items-center justify-center rounded border border-gray-100',
            nextDisabled
              ? 'cursor-not-allowed bg-neutral-100'
              : 'hover:border-blue-600'
          )}
        >
          <span className="sr-only">Next Page</span>
          <FiChevronRight />
        </button>
      </li>
    </ol>
  );
};

// import React from 'react';
// import clsx from 'clsx';
// import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';

// import { pager } from './utils';

// export function Pagination({ page, setPage, className, totalPage }) {
//   const prevDisabled = page === 1;
//   const nextDisabled = page === totalPage;

//   function next() {
//     if (page < totalPage) {
//       setPage((current) => current + 1);
//     }
//   }

//   function previous() {
//     if (page > 1) {
//       setPage((current) => current - 1);
//     }
//   }

//   function goToPage(to) {
//     setPage(to);
//   }

//   return (
//     <div className={clsx('flex w-full justify-center', className)}>
//       <div className="flex">
//         <button
//           disabled={prevDisabled}
//           onClick={previous}
//           data-testid="pagination-previous"
//           className={clsx(
//             'flex h-10 w-10 items-center justify-center rounded-l-md border text-blue-500 hover:text-white focus:outline-none disabled:text-gray-500',
//             prevDisabled ? 'hover:bg-white' : 'hover:bg-blue-500'
//           )}
//         >
//           <AiOutlineLeft />
//         </button>
//         {pager(page, totalPage).map((item, index) => {
//           if (item) {
//             return (
//               <button
//                 key={index}
//                 onClick={() => goToPage(item)}
//                 data-testid="pagination-specific"
//                 className={clsx(
//                   '-ml-px flex h-10 w-10 items-center justify-center border hover:bg-blue-500 hover:text-white focus:outline-none disabled:text-gray-500',
//                   page === item ? 'bg-blue-500 text-white' : ' text-blue-500'
//                 )}
//               >
//                 {item}
//               </button>
//             );
//           } else {
//             return (
//               <button
//                 key={index}
//                 data-testid="pagination-none"
//                 className="-ml-px flex h-10 w-10 items-center justify-center border text-blue-500 focus:outline-none"
//               >
//                 ...
//               </button>
//             );
//           }
//         })}
//         <button
//           disabled={nextDisabled}
//           onClick={next}
//           data-testid="pagination-next"
//           className={clsx(
//             '-ml-px flex h-10 w-10 items-center justify-center rounded-r-md border text-blue-500 hover:text-white focus:outline-none disabled:text-gray-500',
//             nextDisabled ? 'hover:bg-white' : 'hover:bg-blue-500'
//           )}
//         >
//           <AiOutlineRight />
//         </button>
//       </div>
//     </div>
//   );
// }
