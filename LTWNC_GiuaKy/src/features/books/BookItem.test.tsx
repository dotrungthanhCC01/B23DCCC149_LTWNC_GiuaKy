import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { Book } from '../../types/book';
import { BookItem, type BookItemProps } from './BookItem';

const makeBook = (override: Partial<Book> = {}): Book => ({
  id: 'book-7',
  title: 'English Grammar in Use',
  author: 'Raymond Murphy',
  category: 'Ngoại ngữ',
  publishedYear: 2019,
  available: 5,
  coverUrl: 'https://example.com/cover.jpg',
  ...override,
});

const renderBookItem = (override: Partial<BookItemProps> = {}) => {
  const props: BookItemProps = {
    book: makeBook(),
    isBorrowed: false,
    onBorrow: jest.fn(),
    onReturn: jest.fn(),
    ...override,
  };
  render(<BookItem {...props} />);
  return props;
};

describe('BookItem', () => {
  it('hiển thị đúng tên sách, tác giả, thể loại, năm xuất bản, số bản còn lại và ảnh bìa', () => {
    renderBookItem();

    expect(screen.getByRole('heading', { name: 'English Grammar in Use' })).toBeInTheDocument();
    expect(screen.getByText('Raymond Murphy')).toBeInTheDocument();
    expect(screen.getByText('Ngoại ngữ')).toBeInTheDocument();
    expect(screen.getByText('Năm xuất bản: 2019')).toBeInTheDocument();
    expect(screen.getByText('Còn 5 bản')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Bìa sách English Grammar in Use' })).toHaveAttribute('loading', 'lazy');
  });

  it('click "Mượn" gọi onBorrow đúng 1 lần với đúng id sách', async () => {
    const user = userEvent.setup();
    const { onBorrow } = renderBookItem();

    await user.click(screen.getByRole('button', { name: 'Mượn' }));

    expect(onBorrow).toHaveBeenCalledTimes(1);
    expect(onBorrow).toHaveBeenCalledWith('book-7');
  });

  it('vô hiệu hoá nút "Mượn" khi sách đã hết bản', async () => {
    const user = userEvent.setup();
    const { onBorrow } = renderBookItem({ book: makeBook({ available: 0 }) });

    const button = screen.getByRole('button', { name: 'Mượn' });
    expect(button).toBeDisabled();
    expect(screen.getByText('Hết sách')).toBeInTheDocument();

    await user.click(button);
    expect(onBorrow).not.toHaveBeenCalled();
  });

  it('chỉ hiện nút "Trả" khi đang mượn, click gọi onReturn với đúng id', async () => {
    const user = userEvent.setup();
    const { onReturn } = renderBookItem({ isBorrowed: true });

    await user.click(screen.getByRole('button', { name: 'Trả' }));
    expect(onReturn).toHaveBeenCalledWith('book-7');
  });

  it('không hiện nút "Trả" khi chưa mượn', () => {
    renderBookItem();
    expect(screen.queryByRole('button', { name: 'Trả' })).not.toBeInTheDocument();
  });
});
