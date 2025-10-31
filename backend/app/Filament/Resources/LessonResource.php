<?php

namespace App\Filament\Resources;

use App\Filament\Resources\LessonResource\Pages;
use App\Models\Lesson;
use App\Models\Module;
use BackedEnum;
use Filament\Actions;
use Filament\Forms;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables;
use Filament\Tables\Table;

class LessonResource extends Resource
{
    protected static ?string $model = Lesson::class;

    protected static string | BackedEnum | null $navigationIcon = 'heroicon-o-book-open';

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->schema([
                Forms\Components\Select::make('module_id')
                    ->label('Module')
                    ->options(Module::pluck('title', 'id'))
                    ->required()
                    ->searchable(),
                Forms\Components\TextInput::make('title')
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('slug')
                    ->required()
                    ->maxLength(255)
                    ->unique(ignoreRecord: true),
                Forms\Components\Textarea::make('description')
                    ->required()
                    ->rows(3)
                    ->columnSpanFull(),
                Forms\Components\Select::make('type')
                    ->required()
                    ->options([
                        'video' => 'Video',
                        'reading' => 'Reading',
                        'quiz' => 'Quiz',
                    ]),
                Forms\Components\TextInput::make('order')
                    ->required()
                    ->numeric()
                    ->default(1),
                Forms\Components\TextInput::make('duration')
                    ->required()
                    ->numeric()
                    ->suffix(' min'),
                Forms\Components\TextInput::make('video_url')
                    ->label('Video URL')
                    ->url()
                    ->maxLength(255)
                    ->helperText('YouTube URL (unlisted)'),
                Forms\Components\FileUpload::make('pdf_url')
                    ->label('PDF File')
                    ->acceptedFileTypes(['application/pdf'])
                    ->maxSize(10240)
                    ->columnSpanFull(),
                Forms\Components\RichEditor::make('content')
                    ->columnSpanFull(),
                Forms\Components\Toggle::make('is_published')
                    ->required()
                    ->default(false),
                Forms\Components\Toggle::make('is_free')
                    ->required()
                    ->default(false),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('module.title')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('title')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('type')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'video' => 'success',
                        'reading' => 'info',
                        'quiz' => 'warning',
                    })
                    ->sortable(),
                Tables\Columns\TextColumn::make('order')
                    ->numeric()
                    ->sortable(),
                Tables\Columns\TextColumn::make('duration')
                    ->numeric()
                    ->sortable()
                    ->suffix(' min'),
                Tables\Columns\IconColumn::make('is_published')
                    ->boolean()
                    ->sortable(),
                Tables\Columns\IconColumn::make('is_free')
                    ->boolean()
                    ->sortable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('module')
                    ->relationship('module', 'title'),
                Tables\Filters\SelectFilter::make('type')
                    ->options([
                        'video' => 'Video',
                        'reading' => 'Reading',
                        'quiz' => 'Quiz',
                    ]),
                Tables\Filters\TernaryFilter::make('is_published')
                    ->label('Published')
                    ->boolean(),
                Tables\Filters\TernaryFilter::make('is_free')
                    ->label('Free')
                    ->boolean(),
            ])
            ->actions([
                Actions\EditAction::make(),
                Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Actions\BulkActionGroup::make([
                    Actions\DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('order');
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListLessons::route('/'),
            'create' => Pages\CreateLesson::route('/create'),
            'edit' => Pages\EditLesson::route('/{record}/edit'),
        ];
    }
}
